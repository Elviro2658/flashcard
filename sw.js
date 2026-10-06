/* =========================================================
   Flashcard v58 Service Worker
   ========================================================= */

var CACHE_NAME='fc-cache-v58';

self.addEventListener(
  'install',
  function(e){

    e.waitUntil(

      caches.open(CACHE_NAME)
        .then(function(cache){

          return Promise.all([
            cache.add('./app-v58.html').catch(function(){}),
            cache.add('./').catch(function(){})
          ]);

        })
        .then(function(){

          return self.skipWaiting();

        })

    );

  }
);


self.addEventListener(
  'activate',
  function(e){

    e.waitUntil(

      caches.keys()
        .then(function(keys){

          return Promise.all(

            keys.map(function(k){

              if(k!==CACHE_NAME){

                return caches.delete(k);

              }

            })

          );

        })
        .then(function(){

          return self.clients.claim();

        })

    );

  }
);


self.addEventListener(
  'fetch',
  function(e){

    var r=e.request;

    if(
      r.method!=='GET' ||
      new URL(r.url).origin!==self.location.origin
    ){

      return;

    }


    /*
     * اول شبکه:
     * نسخه جدید app-v58 سریع‌تر دریافت می‌شود.
     *
     * در صورت قطعی:
     * cache استفاده می‌شود.
     */

    e.respondWith(

      fetch(
        r,
        {
          cache:'no-store'
        }
      )

      .then(function(res){

        if(
          res &&
          res.ok
        ){

          var cp=res.clone();

          caches.open(CACHE_NAME)
            .then(function(cache){

              cache.put(r,cp);

            })
            .catch(function(){});

        }

        return res;

      })

      .catch(function(){

        return caches.match(
          r,
          {
            ignoreSearch:true
          }
        )

        .then(function(hit){

          if(hit){

            return hit;

          }

          return caches.match(
            './app-v58.html'
          );

        });

      })

    );

  }
);
