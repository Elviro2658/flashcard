/* =========================================================
   Flashcard v59 Service Worker
   شبکه اول + cache نسخه‌دار + cache کردن v59 و هستهٔ v56
   ========================================================= */
var CACHE_NAME='fc-cache-v59';
var ASSETS=['./app-v59.html','./app-v56.html','./'];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        return Promise.all(
          ASSETS.map(function(x){
            return cache.add(x).catch(function(){});
          })
        );
      })
      .then(function(){
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.map(function(k){
          return k===CACHE_NAME ? null : caches.delete(k);
        })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch',function(e){
  var r=e.request;

  if(
    r.method!=='GET' ||
    new URL(r.url).origin!==self.location.origin
  ) return;

  e.respondWith(
    fetch(r,{cache:'no-store'})
      .then(function(res){
        if(res && res.ok){
          var cp=res.clone();

          caches.open(CACHE_NAME).then(function(c){
            c.put(r,cp);
          }).catch(function(){});
        }

        return res;
      })
      .catch(function(){
        return caches.match(r,{ignoreSearch:true}).then(function(hit){
          if(hit) return hit;

          return caches.match('./app-v59.html').then(function(fallback){
            return fallback || caches.match('./app-v56.html');
          });
        });
      })
  );
});
