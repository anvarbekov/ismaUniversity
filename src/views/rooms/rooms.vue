<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";

export default {
  name: "rooms",
  data() {
    return {
      lokalUser: '',
      addRoom:{
        nomi: "",
        raqami: 0,
        user_id: 0,
        masul_shaxs: ""
      },
      roomList: []
    }
  },
  methods: {
    async getRooms() {
      this.roomList = []
      try {
        const result = await axios.get('honalar?token='+ this.lokalUser.token);
        if (result.status === 200) {
          this.roomList = result.data.data
          console.log(this.roomList)
        }
      }catch (e) {
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
          this.addRoom = {
            nomi: "",
            raqami: 0,
            user_id: 0,
            masul_shaxs: ""
          }
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
        const result = await axios.get('delete?honalar&id=' + honaId +'&token='+ this.lokalUser.token);
        if (result.data.status) {
          await this.getRooms();
          this.successRoomToast();
        }
      } catch (e) {
        this.errorToast();
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
  }
}
</script>

<template>
  <div class="content-wrapper">
    <!-- Content -->

    <div class="container-xxl flex-grow-1 container-p-y">
      <h4 class="fw-bold py-3 mb-4"> Xonalar </h4>

      <!-- Basic Bootstrap Table -->
        <!-- Bordered Table -->
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <h5 class="">Xonalar</h5>
            <button type="button" class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRoomModal">
              Xona qo'shish  </button>
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
                  <label> Xona nomi </label>
                  <input v-model="addRoom.nomi" type="text" class="form-control">
                  <label> Xona Raqami </label>
                  <input v-model="addRoom.raqami" type="number" class="form-control">
                  <label> Masul shaxslar </label>
                  <input v-model="addRoom.masul_shaxs" type="text" class="form-control">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                  <button @click="createRoom" type="button" class="btn btn-primary" data-bs-dismiss="modal">Saqlash</button>
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
                  <th>O'chirib yuborish</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(room, index) in roomList" :key="index">
                  <td>  <router-link :to="{name: 'roomDetails', params: {seoXonaId: room.id}}"
                                     class="text-decoration-underline">
                    {{ room.nomi }} </router-link> </td>
                  <td>{{ room.raqami }}</td>
                  <td>{{ room.masul_shaxs }}</td>
                  <td>

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