# Products API (System Design Capstone) 

A back-end system that supports the frontend of Urban Octo Chainsaw Clothing (Catwalk).

![ezgif com-gif-maker](https://user-images.githubusercontent.com/76494184/147984331-5d1ac329-11eb-4534-afd4-8e1e065a5aa9.gif)

The purpose of this repository is to replace the already existing API that came with the creation of Catwalk with a larger, more robust API that can support the full data set of the project and can scale to meet the demands of production traffic. Each member of our team was responsible for one service of the catwalk application: 

 - Miguel Regalado - Products <br /> <a href="https://github.com/miguelmar21"><img src="https://avatars.githubusercontent.com/u/76494184?v=4" alt="Miguel Regalado" width="65"/></a>
 - Patrick Lorden - Reviews <br /> <a href="https://github.com/Hellequin5"><img src="https://avatars.githubusercontent.com/u/89110644?v=4" alt="Patrick Lorden" width="65"/></a>
 - Sam Martin - Questions <br /> <a href="https://github.com/martin110sam"><img src="https://avatars.githubusercontent.com/u/78275235?v=4" alt="Sam Martin" width="65"/></a>

Each member of the team carefully chose an appropriate database that best supported their service. In this particular service, MongoDB was chosen as its database. We then transformed existing application data that came in the form of CSV files into the database using parser functions. These functions were constructed precisely (with the help of the fast-csv library) to adjust to each distinct structure of the CSV files, making the ETL (Extract, transform, load) process much faster and simpler. With this process, we were able to architect the data to fit perfectly within the database in accordance to the frontend-backend communication bridge. 

---

### REPO INSTRUCTIONS

1: On a new directory, open up terminal and run: ``` git clone https://github.com/miguelmar21/Products-API ```<br />
2: ``` npm install && npm run fec-install``` <br />
3: On two split terminals: <br />
```
   npm run build
   npm start 
```
4: Open localhost:4000 in your browser <br />
