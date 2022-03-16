// -*- mode: javascript; indent-tabs-mode: nil; c-basic-offset: 8 -*-
"use strict";

// Base layers configuration
function createBaseLayers() {
	var layers = [];

	var world = [];
	var country = [];
	var us = [];

	// DarkMode for OpenStreetMap
	world.push(new ol.layer.Tile({
		source: new ol.source.OSM({
			"url": "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
		}),
		name: 'osm dark',
		title: 'OpenStreetMap Dark',
		type: 'base',
	}));


	// ------------------------------------------------------------
	// AKISSACK - DEFAULT MAPS ------------------- ref: AK2A starts
	// ------------------------------------------------------------
	if (ShowAdditionalMaps) {
		world.push(new ol.layer.Tile({
			source: new ol.source.OSM({
				"url": "http://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
			}),
			name: 'osm light',
			title: 'OpenStreetMap Light',
			type: 'base',
			preload: Infinity,
		}));
	}


	// ------------------------------------------------------------
	// ---------------------------------------------- ref: AK2A ends
	// ------------------------------------------------------------

	world.push(new ol.layer.Tile({
		source: new ol.source.OSM(),
		name: 'osm',
		title: 'OpenStreetMap',
		type: 'base',
	}));

	// ------------------------------------------------------------
	// AKISSACK - additional MAPS ---------------- ref: AK2B starts
	// ------------------------------------------------------------
	if (ShowAdditionalMaps) {
		world.push(new ol.layer.Tile({
			source: new ol.source.OSM({
				"url": "http://{a-d}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
				"attributions": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
					'Data by <a _href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
			}),
			name: 'terrain',
			title: 'Terrain + Roads',
			type: 'base',
		}));

		world.push(new ol.layer.Tile({
			source: new ol.source.OSM({
				"url": "http://{a-d}.tile.stamen.com/terrain-background/{z}/{x}/{y}.png",
				"attributions": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
					'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
			}),
			name: 'terrain',
			title: 'Terrain',
			type: 'base',
		}));

	}
	// ------------------------------------------------------------
	// ---------------------------------------------- ref: AK2B ends
	// ------------------------------------------------------------

	if (BingMapsAPIKey) {
		world.push(new ol.layer.Tile({
			source: new ol.source.BingMaps({
				key: BingMapsAPIKey,
				imagerySet: 'Aerial'
			}),
			name: 'bing_aerial',
			title: 'Bing Aerial',
			type: 'base',
			preload: Infinity,
		}));

		world.push(new ol.layer.Tile({
			source: new ol.source.BingMaps({
				key: BingMapsAPIKey,
				imagerySet: 'Road',
				//imagerySet: 'CanvasDark',
			}),
			preload: Infinity,
			name: 'bing_roads',
			title: 'Bing Roads',
			type: 'base',

		}));
	}


	// ------------------------------------------------------------
	// AKISSACK - US Layers ---------------------- ref: AK3A starts
	// ------------------------------------------------------------

	if (ShowUSLayers) {

		var refreshNexrad = function() {
			// re-build the source to force a refresh of the nexrad tiles
			var now = new Date().getTime();
			nexrad.setSource(new ol.source.XYZ({
				url: 'http://mesonet{1-3}.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_=' + now,
				attributions: 'NEXRAD courtesy of <a href="http://mesonet.agron.iastate.edu/">IEM</a>'
			}));
		};

		if (ChartBundleLayers) {
			var chartbundleTypes = {
				sec: "Sectional Charts",
				tac: "Terminal Area Charts",
				wac: "World Aeronautical Charts",
				enrl: "IFR Enroute Low Charts",
				enra: "IFR Area Charts",
				enrh: "IFR Enroute High Charts"
			};

			for (var type in chartbundleTypes) {
				us.push(new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://wms.chartbundle.com/wms',
						params: {
							LAYERS: type
						},
						projection: 'EPSG:3857',
						attributions: 'Tiles courtesy of <a href="http://www.chartbundle.com/">ChartBundle</a>'
					}),
					name: 'chartbundle_' + type,
					title: chartbundleTypes[type],
					type: 'base',
					group: 'chartbundle'
				}));
			}


		}


		var nexrad = new ol.layer.Tile({
			name: 'nexrad',
			title: 'NEXRAD',
			type: 'overlay',
			opacity: 0.5,
			visible: false
		});
		us.push(nexrad);

		refreshNexrad();
		window.setInterval(refreshNexrad, 5 * 60000);



	}
	// ------------------------------------------------------------
	// AKISSACK - US Layers ---------------------- ref: AK3A ends
	// ------------------------------------------------------------

	if (world.length > 0) {
		layers.push(new ol.layer.Group({
			name: 'world',
			title: 'Worldwide',
			layers: world
		}));
	}

	if (us.length > 0) {
		layers.push();
	}



	// --------------------------------------------------------------
	// AKISSACK - ADD LAYERS ----------------------  ref: AK4A starts
	// --------------------------------------------------------------

	if (ShowUKCivviLayers) {
		var vordmeLayer = new ol.layer.Vector({
			name: 'vordme',
			type: 'overlay',
			title: 'VOR/DME',
			source: new ol.source.Vector({
				url: 'layers/UK_VOR+DME+NDB+TACAN.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: (function() {
				var style = new ol.style.Style({
					image: new ol.style.Icon({
						src: 'layers/img/vor+ndb.png'
					}),
					text: new ol.style.Text({
						text: 'field-1',
						scale: 1,
						offsetX: 1,
						offsetY: -11,
						fill: new ol.style.Fill({
							color: '#003300'
						}),
						//stroke: new ol.style.Stroke({
						//	color: '#ccffcc',
						//	width: 3.5
						//})
					})
				});
				var styles = [style];
				return function(feature, resolution) {
					style.getText().setText(feature.get("field_2"));
					return styles;
				};
			})()
		});
		vordmeLayer.setVisible(false);

		//UK_NavigationPoints.geojson
		var navPointsLayer = new ol.layer.Vector({
			name: 'navigation',
			type: 'overlay',
			title: 'Nav Points',
			source: new ol.source.Vector({
				url: 'layers/UK_NavigationPoints.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),

			style: (function() {
				var style = new ol.style.Style({
					image: new ol.style.Icon({
						src: 'layers/img/point.png'
					}),
					text: new ol.style.Text({
						text: 'field-1',
						scale: 0.75,
						offsetX: -1,
						offsetY: 10,
						fill: new ol.style.Fill({
							color: '#003300'
						}),
					})
				});

				var styles = [style];
				return function(feature, resolution) {
					style.getText().setText(feature.get("field_2"));
					return styles;
				};
			})()
		});
		navPointsLayer.setVisible(false);

		var airwaysLayer = new ol.layer.Vector({
			name: 'airways',
			type: 'overlay',
			title: 'Airways',
			source: new ol.source.Vector({
				url: 'layers/UK_Airways.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0, 102,0, 0.07)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 64,0, 0.5)',
					width: 0.2
				})
			})
		});
		airwaysLayer.setVisible(false);

		var airwaysMRCLayer = new ol.layer.Vector({
			name: 'airwaysMRC',
			type: 'overlay',
			title: 'Radar Corridors',
			source: new ol.source.Vector({
				url: 'layers/UK_Mil_RC.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(102, 0,0, 0.07)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(255, 0,0, 0.5)',
					width: 0.2
				})
			})
		});
		airwaysMRCLayer.setVisible(false);



		var ukCTALayer = new ol.layer.Vector({
			name: 'ukcta',
			type: 'overlay',
			title: 'CTA/TMA',
			source: new ol.source.Vector({
				url: 'layers/UK_AT_Areas.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0, 127,0, 0.03)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0,64,0, 0.2)',
					width: 1
				})
			})

		});
		ukCTALayer.setVisible(false);

		var atzLayer = new ol.layer.Vector({
			name: 'atz',
			type: 'overlay',
			title: 'CTR',
			source: new ol.source.Vector({
				url: 'layers/UK_ATZ.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0,255,0, 0.03)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 80, 0, 0.5)',
					width: 1
				})
			})

		});

		var airportLayer = new ol.layer.Vector({
			name: 'airways',
			type: 'overlay',
			title: 'Airports',
			source: new ol.source.Vector({
				url: 'layers/UK_Civi_Airports.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(200,16,64, 0.5)',
					width: 1.5
				})
			})
		});

		var ukairspaceLayer = new ol.layer.Vector({
			name: 'ukair',
			type: 'overlay',
			title: 'UK Airspace',
			source: new ol.source.Vector({
				url: 'layers/UK_Airspace.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0,102,0, 0.2)',
					width: 3
				})
			})
		});
		ukairspaceLayer.setVisible(false)
	}
	// --------------------------------------------------------------
	// AKISSACK - ADD LAYERS ----------------------  ref: AK5A starts
	// --------------------------------------------------------------

	if (ShowUKMilLayers) {
		var dangerLayer = new ol.layer.Vector({
			name: 'danger',
			type: 'overlay',
			title: 'Danger Areas',
			source: new ol.source.Vector({
				url: 'layers/UK_Danger_Areas.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 0,0, 0.05)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(255, 0,0, 0.5)',
					width: 0.75
				})
			})
		});
		dangerLayer.setVisible(false);

		var AARLayer = new ol.layer.Vector({
			name: 'aar',
			type: 'overlay',
			title: 'AAR Areas',
			source: new ol.source.Vector({
				url: 'layers/UK_Mil_AAR_Zones.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0,0,255, 0.05)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0,0,128, 0.5)',
					width: 0.75
				})
			})

		});
		AARLayer.setVisible(false);

		var matzLayer = new ol.layer.Vector({
			name: 'matz',
			type: 'overlay',
			title: 'MATZ',
			source: new ol.source.Vector({
				url: 'layers/UK_MATZ.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0,0,255, 0.05)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(128,0,0, 0.5)',
					width: 0.75
				})
			})
		});

		var matzafLayer = new ol.layer.Vector({
			name: 'matzaf',
			type: 'overlay',
			title: 'Airfields',
			source: new ol.source.Vector({
				url: 'layers/UK_Mil_Airfield_runways.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(200,16,64, 0.5)',
					width: 1
				})
			})
		});

		var ukmilLayer = new ol.layer.Vector({
			name: 'ukmil',
			type: 'overlay',
			title: 'TACAN Routes',
			source: new ol.source.Vector({
				url: 'layers/UK_Military_TACAN_Routes.geojson',
				format: new ol.format.GeoJSON({
					defaultDataProjection: 'EPSG:4326',
					projection: 'EPSG:3857'
				})
			}),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0,0,102,0.2)',
					width: 3
				})
			})
		});
		ukmilLayer.setVisible(false);


	}

	// --------------------------------------------------------------
	// AKISSACK - ADD LAYERS ----------------------  ref: AK4A ends
	// --------------------------------------------------------------

	if (ShowMyFindsLayer && SleafordMySql) { // AKISSACK Ref: AK9U
		var myLayer = new ol.layer.Vector({
			name: 'my_layer',
			type: 'base',
			title: 'My Layer',
			source: new ol.source.Vector({
				features: MyFeatures,
			})
		});

		layers.push(new ol.layer.Group({
			title: 'Private',
			layers: [myLayer]
		}));
	};



	//layerswitcher config main
	layers.push(new ol.layer.Group({
		name: 'country',
		title: 'Country specific',
		fold: 'close',
		layers: [
				new ol.layer.Group({
				fold: 'closed',
				title: 'UK',
				layers: [
										ukairspaceLayer,
										airwaysLayer,
										airwaysMRCLayer,
										airportLayer,
										atzLayer,
										ukCTALayer,
										vordmeLayer,
										navPointsLayer
								]
			}),
				new ol.layer.Group({
				title: 'UK Military',
				fold: 'closed',
				layers: [
										matzLayer,
										matzafLayer,
										dangerLayer,
										ukmilLayer,
										AARLayer
										]
			}),
				new ol.layer.Group({
				name: 'us',
				visible: false,
				fold: 'closed',
				title: 'USA',
				layers: us
			})
			]
	}));

	return layers;
}

//AC Position layer
var iconsLayer = new ol.layer.Vector({
	name: 'ac_positions',
	type: 'overlay',
	title: 'Aircraft positions',
	source: new ol.source.Vector({
		features: PlaneIconFeatures,
	})
});
