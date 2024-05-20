<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";

export default {
  name: "roomDetails",
  props: ['seoXonaId'],
  data() {
    return {
      lokalUser: '',
      addRoom:{
        nomi: "",
        raqami: 0,
        user_id: 0,
        masul_shaxs: ""
      },
      buyurtma: {
        hona_id: 0,
        jihoz_id: 0,
        soni: 0
      },
      jihoz: null,
      roomFurnitureList: [],
      roomData : {
        id: '0', user_id: '0', masul_shaxs: '0', raqami: '0', nomi: '0'
      },
      furnitureList: []
    }
  },
  methods: {
    async getRooms() {
      try {
        const result = await axios.get('honalar?id='+ this.seoXonaId +'&token='+ this.lokalUser.token);
        if (result.status === 200) {
          this.roomData = result.data.data
        }
      }catch (e) {
        console.error(e.message)
      }
    },
    async getFurnituresList() {
      this.furnitureList = []
      try {
        const result = await axios.get('ombor.php?token='+ this.lokalUser.token);
        if (result.status === 200) {
          this.furnitureList = result.data.data;
          this.jihoz = this.furnitureList.length > 0 ? this.furnitureList[0].id : null
          console.log('furnitures: ',result.data)
        }
      }catch (e) {
        console.error(e.message)
      }
    },
    async getFurnitureRoom() {
      this.roomFurnitureList = []
      try {
        const result = await axios.get('hona_jihozlari.php?' +'token='+ this.lokalUser.token + '&hona_id='+this.seoXonaId);
          this.roomFurnitureList = result.data.data
          console.log('honaga jihozlar', this.roomFurnitureList)
        if (result.status === 200) {

        }
      } catch (e) {
        console.error(e.message)
      }
    },
    async createRoom() {
      this.addRoom.user_id = Number(this.lokalUser.id);
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        const result = await axios.post('honalar.php?token='+ this.lokalUser.token, this.addRoom, cfg);
        if (result.data.status) {
          await this.getRooms();
          this.createRoomToast();
        } else {
          this.errorToast();
        }
      } catch (e) {
        this.errorToast();
        console.error(e.message)
      }
    },
    async deleteRoom(honaId) {
      try {
        const result = await axios.get('delete?hona_jihozlari&id=' + honaId +'&token='+ this.lokalUser.token);
        if (result.data.status) {
          await this.getFurnitureRoom();
          this.successRoomToast();
        }
      } catch (e) {
        this.errorToast();
        console.error(e.message)
      }
    },
    async createBuyurtma() {
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.buyurtma.hona_id = Number(this.seoXonaId)
      try {
        const result = await axios.post('buyurtmalar.php?token='+ this.lokalUser.token, this.buyurtma, cfg);
        if (result.data.status) {
          this.successRoomToast();
        } else {
          this.errorToast();
        }
      } catch (e) {
        console.error(e.message)
      }
    },
    createRoomToast() {
      this.toast.success("Xona muvaffaqiyatli yaratildi", {
        position: "top-right",
        timeout: 1800,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false
      });
    },
    successRoomToast() {
      this.toast.success(" muvaffaqiyatli bajarildi", {
        position: "top-right",
        timeout: 1800,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false
      });
    },
    errorToast() {
      this.toast.error("Xatolik yuz berdi", {
        position: "top-right",
        timeout: 1800,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false
      });
    },
  },
  setup() {
    const v$ = useVuelidate();
    const toast = useToast();
    return {v$, toast}
  },
  async mounted() {
    this.lokalUser = JSON.parse(localStorage.getItem('lokalUser'));
    await this.getRooms();
    await this.getFurnitureRoom();
    await this.getFurnituresList();
  }

}
</script>

<template>
  <div class="content-wrapper">
    <!-- Content -->

    <div class="container-xxl flex-grow-1 container-p-y">
      <h4 class="fw-bold py-3 mb-4"> Xona nomi: {{roomData.nomi}} ||  Raqami: {{roomData.raqami}} || Masul shaxs: {{roomData.masul_shaxs}} </h4>

      <!-- Basic Bootstrap Table -->
      <!-- Bordered Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <h5 class="">Xona jihozlari</h5>
          <button type="button" class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRoomModal">
            Xona jihoz qo'shish  </button>
        </div>
        <!--    add room modal-->

        <!-- Modal -->
        <div class="modal fade" id="addRoomModal" tabindex="-1" aria-labelledby="addRoomModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="addRoomModalLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <label> Jihozni tanlang </label>
                <select class="select2 form-select" v-model="buyurtma.jihoz_id">
                  <option v-for="(item, index) in furnitureList" :key="index" :value="item.id"
                          :selected="index === 0">{{ item.jihoz_nomi }}</option>
                </select>

                <label> Sonini kiriting </label>
                <input v-model="buyurtma.soni" type="number" class="form-control">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                <button @click="createBuyurtma" type="button" class="btn btn-primary" data-bs-dismiss="modal">Saqlash</button>
              </div>
            </div>
          </div>
        </div>
        <!--   add room modal       -->
        <div class="card-body">
          <div class="table-responsive text-nowrap">
            <table class="table table-bordered">
              <thead>
              <tr>
                <th>Xona nomi</th>
                <th>Xona raqami</th>
                <th>Maxsus shaxslar</th>
                <th>Tahrirlash</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(room, index) in roomFurnitureList" :key="index">
                <td> {{room.jihoz_nomi}}   </td>

                <td>{{ room.buyutma_soni }}</td>
                <td>{{ room.masul_shaxs }}</td>
                <td>
                  <button class="badge badge-center bg-warning btn me-3">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn badge badge-center bg-danger" data-bs-toggle="modal" :data-bs-target="'#roomDeleteModal_' + index">
                    <i class="fa-solid fa-trash"></i>
                  </button>

                  <!-- Modal -->
                  <div class="modal fade" :id="'roomDeleteModal_' + index" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'roomDeleteModalLabel_' + index" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" :id="'roomDeleteModalLabel_' + index">Xona O'chirish</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <h4> {{ room.nomi }} ni xonani o'chirishni xoxlaysizmi?</h4>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Yo'q</button>
                          <button type="button" class="btn btn-primary" @click="deleteRoom(room.id)" data-bs-dismiss="modal">Ha</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
      <!--/ Bordered Table -->


    </div>
    <!-- / Content -->



  </div>
</template>

<style scoped>

</style>