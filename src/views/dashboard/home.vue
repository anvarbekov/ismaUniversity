<script>
import axios from "axios";


export default {
  name: "home",
  data() {
    return {

        countRooms: 0,
        countFurnitures: 0,
        city: 'Fergana',
        api_key: 'f6a2c317f97367bfe8fa3e5fc517e80d',
        url_base: 'https://api.openweathermap.org/data/2.5/',
        query: 'Fergana',
        weather: {},
        
    }
  },
  methods: {
   
      async fetchRooms() {
        try {
          let result = await axios.get('honalar?token='+ this.lokalUser.token);
          this.countRooms = result.data.data.length;
        } catch(e) {
          console.error(e.message);
        }
      },
      async fetchFurnitures() {
        try {
          let result = await axios.get('hona_jihozlari?token='+ this.lokalUser.token);
          this.countFurnitures = result.data.data.length;
          console.log(result.data);
        } catch(e) {
          console.error(e.message);
        }
      },
      async fetchWeather2(city) {
        const customAxios = axios.create();
        const APIKey = "96b947a45d33d7dc1c49af3203966408";
        let result = await customAxios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`);
          this.weather = result.data
     
      },
      setResults (results) {
        this.weather = results;
      },
      dateBuilder () {
      let d = new Date();
      let months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
      let days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();

      return `${day} ${date} ${month} ${year}`;
    }
  },
  async mounted() {
    this.lokalUser = await JSON.parse(localStorage.getItem('lokalUser'));
    await this.fetchRooms();
    await this.fetchFurnitures();
    await this.fetchWeather2(this.city);
  }
}
</script>

<template>
  <div class="content-wrapper">
            <!-- Content -->

            <div class="container-xxl flex-grow-1 container-p-y">
              <div class="row">
                <div class="col-lg-8 mb-4 order-0">
                  <div class="card">
                    <div class="d-flex align-items-end row">
                      <div class="col-sm-7">
                        <div class="card-body">
                          <h5 class="card-title text-primary">Welcome to Inversion system 🎉</h5>
                          <p class="mb-4"><span style="color: #696CFF; font-weight: 700;">
                            ISMA (Higher School of Information Systems Management)</span> 
                            It is one of the leading universities in Latvia. 
                             is one of the top 10 universities in the country. Our students studying in this institute 
                             Discover something new every day, allowing you to visit Spain, Greece and Bulgaria 
                             actively participate in international practices and practices. In addition, they study and travel around the world
                              participate in the combined Erasmus and Work and Travel programs! Become an ISMA student and live a real student life 
                              experience it!
                            
                            </p>

                        </div>
                      </div>
                      <div class="col-sm-5 text-center text-sm-left">
                        <div class="card-body pb-0 px-0 px-md-4">
                          <img
                            src="@/assets/img/man-with-laptop-light.png"
                            height="140"
                            alt="View Badge User"
                            data-app-dark-img="illustrations/man-with-laptop-dark.png"
                            data-app-light-img="illustrations/man-with-laptop-light.png"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 order-1">
                  <div class="row">
                    <div class="col-lg-6 col-md-12 col-6 mb-4">
                      <div class="card">
                        <div class="card-body">
                          <div class="card-title d-flex align-items-start justify-content-between">
                            <div class="">
                              <span class="fw-semibold d-block mb-1">Rooms</span>
                             
                            </div>
                            
                          </div>
                          <h3 class="card-title mb-2"> {{ countRooms}} </h3>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-12 col-6 mb-4">
                      <div class="card">
                        <div class="card-body">
                          <div class="card-title d-flex align-items-start justify-content-between">
                            <div class="">
                              <span class="fw-semibold d-block mb-1"> Furnitures </span>
                             
                            </div>
                            
                          </div>
                          <h3 class="card-title mb-2"> {{countFurnitures}} </h3>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>

                
              </div>


          </div>

          <div class="row justify-content-center">
                  <div id="application" class="rounded" :class="typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' : ''">
                    <main>
                      <div class="search-box">
                        <input  type="text"  class="search-bar"   placeholder="Search..."
                                v-model="city"  @input="fetchWeather2(this.city)"   />
                      </div>

                    <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
                      <div class="location-box">
                        <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
                        <div class="date">{{ dateBuilder() }}</div>
                    </div>

                    <div class="weather-box">
                      <div class="temp">{{ Math.round(weather.main.temp) }}°c</div>
                      <div class="weather">{{ weather.weather[0].main }}</div>
                    </div>
                  </div>
                  </main>
                  </div>
                  </div>
            </div>
</template>

<style scoped>
#application {
  background-image: url('@/assets/img/cold-bg.jpg');
  background-size: cover;
  transition: 0.4s;
  max-width: 650px;
}

#application.warm {
  background-image: url('@/assets/img/warm-bg.jpg');
}

main {
  min-height: 600px;
  padding: 25px;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75));
}

.search-box {
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  
  color: #313131;
  font-size: 20px;

  appearance: none;
  border:none;
  outline: none;
  background: none;

  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;
}

.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px 0px 16px 0px;
}

.location-box .location {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}

.location-box .date {
  color: #FFF;
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
}

.weather-box {
  text-align: center;
}

.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #FFF;
  font-size: 102px;
  font-weight: 900;

  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color:rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;

  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .weather {
  color: #FFF;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
</style>