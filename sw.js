var C='fc-cache-v2';
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.add(new Request('app-v55.html',{cache:'reload'})).catch(function(){})}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('app-v55.html')})}))});
