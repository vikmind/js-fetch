/*!
 * jsFetch v1.1.2
 * (c) Nghiep<me@nghiepit.pro>
 * MIT License.
 */

(() => {
  const urls = [];

  const jsFetch = (url, waitVar, attributes = {}, timeout = 15000) => {
    return new Promise((resolve, reject) => {
      if (typeof document !== 'undefined') {
        if (!urls.includes(url)) {
          const el = document.createElement('script');
          el.src = url;
          
          if (typeof attributes === 'object' && !Array.isArray(attributes)) {
            for(const i in attributes) {
              el[i] = attributes[i];
            }
          }
          
          el.onerror = el.onload = err => {
            if (err && err.type === 'error') {
              el.remove();
              reject(err);
            }
            if (waitVar) {
              resolve(window[waitVar]);
            }
            resolve();
          };

          document.body.appendChild(el);
          urls.push(url);
        } else {
          if (waitVar) {
            const timerInterval = setInterval(() => {
              if (window[waitVar]) {
                clearInterval(timerInterval);
                resolve(window[waitVar]);
              }
            }, 500);

            setTimeout(() => {
              clearInterval(timerInterval);
              reject('Cannot found variable ' + waitVar);
            }, timeout);

          } else {
            resolve();
          }
        }
      } else {
        reject(new Error('This package is not called during SSR.'));
      }
    });
  }

  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = jsFetch;
  } else if(typeof define === 'function' && define.amd) {
    define(() =>  jsFetch);
  } else if (typeof window !== 'undefined') {
    window.jsFetch = jsFetch;
  }
})();