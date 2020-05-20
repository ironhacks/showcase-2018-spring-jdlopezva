## webapp_phase5

1. Name of App: Alojamiento NY

2. Keywords: Districts, Map, Safety, Distance, Affordability.

3. Datasets:
- [NY Districts geoshapes] [https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson][GEOJSON with coordinates of the shapes of the districts for draw the polygons in the map]
- [Neighborhood Names GIS] [https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD][Json with coordinates of the center of all neighborhood of New York]
- [Crimes in NY] [https://data.cityofnewyork.us/api/views/xazf-tj86/rows.json?accessType=DOWNLOAD][Json with the a group of crimes hapened in New York]
- [Dataset contains information on New York City housing by building data] [https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD][Json with low income and coordinates of some buildings]
- [New York City Museums] [https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD][Json with coordinates of some museums of New York]
- [Dataset contains information on New York City air quality surveillance data] [https://catalog.data.gov/dataset/air-quality-ef520][Json with percentage of contaminate air by each district]
- [New York City Art Galleries] [https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD][Json with coordinates of some galleries of New York]

4.
- Project Description: This project has been done to help students to find a safe, affordable or close to the NYU Stern School of Business depending on some  parameters. In this project there are tables with the ranking of 59 habitable districts sorted by some parameters, and contain two charts exactly equals for compare the ranks of the districts.

- Map View: The map is located in the NYU Stern School of Business, New York. The map has a cover for show the shape of districts, also has a cover for heat map used for air contamination.

- Data Visualization: The app has two charts(Zoomable Sunburst)exactly equals, They are interactives, they allow to do zoom to the section that you click for compare the ranks of all districts in New York by different parameters.

- Interaction Form: There is no information output. There are operation option for rank the districts(Safety, Distance, Affordability and Average).  There is no information input. There are switch for show the markers of Neighborhoods, Districts, Crimes, Building, Museums and Galleries and for show the heat map of contamination of air. For the interaction with data visualization there are some buttons for sort the districts and export Data, also there is a navbar.

6. Test Case: This project has been tested only on Chrome

7. I had problems with the Map on IronHacks ID, I solved that loading the map Synchronously.
  I had problem with the dataset of galleries because is too large and slow for download
