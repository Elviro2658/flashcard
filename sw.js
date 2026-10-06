/* Flashcard v65: same-origin, network-first offline cache for GitHub Pages. */
var CACHE_NAME='fc-cache-v65';
var ASSETS=['./app-v65.html','./app-v56.html','./'];
self.addEventListener('install',function(event){
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){
    return Promise.all(ASSETS.map(function(asset){return cache.add(asset).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(event){
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(key){
      return key!==CACHE_NAME&&key.indexOf('fc-cache-')===0?caches.delete(key):Promise.resolve(false);
    }));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(event){
  var request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(request,{cache:'no-store'}).then(function(response){
    if(response&&response.ok){
      caches.open(CACHE_NAME).then(function(cache){return cache.put(request,response.clone())}).catch(function(){});
    }
    return response;
  }).catch(function(){
    return caches.match(request,{ignoreSearch:true}).then(function(hit){
      if(hit)return hit;
      return caches.match('./app-v65.html').then(function(current){
        return current||caches.match('./app-v56.html');
      });
    });
  }));
});
