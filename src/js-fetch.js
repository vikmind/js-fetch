import { retry } from 'async';

const urls = [];

export default function(url, waitVar, attributes = {}) {
  return new Promise((resolve, reject) => {
    if (typeof document !== 'undefined') {
      if (!urls.includes(url)) {
        const el = document.createElement('script');
        el.async = true;
        
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
          retry({ times: Number.MAX_SAFE_INTEGER }, callback => {
            if (window[waitVar]) {
              callback(null, window[waitVar]);
            } else {
              callback(new Error('Cannot found variable ' + waitVar));
            }
          }, (err, result) => {
            err && reject(err);
            resolve(result);
          });
        } else {
          resolve();
        }
      }
    } else {
      reject(new Error('This package is not called during SSR.'));
    }
  });
}
