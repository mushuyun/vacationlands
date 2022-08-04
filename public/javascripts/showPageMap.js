
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: campground.geometry.coordinates,
zoom: 10
});
 
const nav = new mapboxgl.NavigationControl({
   visualizePitch: true
});
map.addControl(nav, 'bottom-right');

const marker = new mapboxgl.Marker({
   color: "#3349FF"
})
   .setLngLat(campground.geometry.coordinates)
   .setPopup(new mapboxgl.Popup({offset: 25})
      .setLngLat(campground.geometry.coordinates)
      .setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`))
   
   .addTo(map);
marker();
