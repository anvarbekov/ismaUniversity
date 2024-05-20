<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";
export default {
  name: "ordersAccountant",
  data() {
    return {
      furniture : {
        jihoz_nomi: '',
        soni: 0
      },
      furnitureList: [],
      okayModalShow : false,
      okayModalContent: {

      },
      cancelModalContent: null,
      cancelModalShow: false,
      lokalUser: {
        "id":"9",
        "ism":"kafedra muduri",
        "familiya":"",
        "kasblar_id":"0",
        "login":"",
        "token":""
      },
      okayModalData: null,
    }
  },
  methods: {
    toggleOkayModal(content) {
      this.okayModalShow = !this.okayModalShow;
      if (this.okayModalShow) {
        this.okayModalContent = content;
      } else {
        this.okayModalContent = null;
      }
    },
    toggleCancelModal(content) {
      this.cancelModalShow = !this.cancelModalShow;
      if (this.cancelModalShow) {
        this.cancelModalContent = content
      } else {
        this.cancelModalContent = null;
      }
    },
    async getRooms() {
      this.furnitureList = []
      try {
        const result = await axios.get('buyurtmalar.php?token='+ this.lokalUser.token );
        if (result.status === 200) {
          this.furnitureList = result.data.data;
        }
      }catch (e) {
        console.error(e.message)
      }
    },
    async createFurniture() {
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        const result = await axios.post('ombor.php?token='+ this.lokalUser.token, this.furniture, cfg);
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
    async bugalterBuyurtmaTugatish(orderId) {
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        const result = await axios.post('buyurtma_close?token='+ this.lokalUser.token,{id: orderId}, cfg);
        console.log(result)
      } catch (e) {
        console.error(e.message)
      }
    },
    async buyurtmaOkay(room) {
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        let result = await axios.post('buyurtma_ok?token='+this.lokalUser.token,{id : room.id, masul_shaxs: 2},cfg);
        if (result.data.status === true) {
          this.successRoomToast();
          this.toggleOkayModal(null);
          await this.getRooms();
        }
      }catch (e) {
        console.error(e.message)
      }
    },
    async buyurtCancel(room) {
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        let result = await axios.post('buyurtma_reject?token='+this.lokalUser.token,{id : room.id, masul_shaxs: 2},cfg);
        if (result.data.status === true) {
          this.successRoomToast();
          this.toggleOkayModal(null);
          await this.getRooms();
        }
      }catch (e) {
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
    console.log(this.lokalUser)
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
                <label> Jihoz nomi </label>
                <input v-model="furniture.jihoz_nomi" type="text" class="form-control">
                <label> Soni </label>
                <input v-model="furniture.soni" type="number" class="form-control">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                <button @click="createFurniture" type="button" class="btn btn-primary" data-bs-dismiss="modal">Saqlash</button>
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
                <th>Kim tomonidan</th>
                <th>Xona nomi, raqami</th>
                <th>Jihoz nomi</th>
                <th>Holati</th>
                <th >Tahrirlash</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(room, index) in furnitureList" :key="index"  >
                <td >  {{ room.kmt_ismi }} </td>
                <td >{{ room.hona_nomi }} - {{room.hona_raqami}} </td>
                <td>{{room.jihoz_nomi}} - {{room.buyutma_soni}} </td>
                <td> <span v-if="room.holati === '0'"> Yaratildi</span>
                  <span v-if="room.holati === '1'"> Omborxonada </span>
                  <span v-if="room.holati === '2'"> Kafedraga jo'natildi </span>
                  <span v-if="room.holati === '3'"> Bekor qilindi </span>
                </td>
                <td  v-if="room.holati === '0'">
                  <button class=" bg-success btn-sm btn me-3" style="color: white" @click="toggleOkayModal(room)">
                    <i class="fa-solid fa-check"></i> omborchiga jo'natish
                  </button>

                  <button class="bg-danger btn-sm btn me-3" style="color: white"  @click="toggleCancelModal(room)">
                    <i class="fa-solid fa-ban"></i> Bekor qilish
                  </button>
<!--                  <button  class="btn badge badge-center bg-black" data-bs-toggle="modal" :data-bs-target="'#roomDeleteModal_' + index">-->
<!--                    <i class="fa-solid fa-trash"></i>-->
<!--                  </button>-->

                  <!-- Delete Modal -->
                  <div class="modal fade" :id="'roomDeleteModal_' + index" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'roomDeleteModalLabel_' + index" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" :id="'roomDeleteModalLabel_' + index">Xona O'chirish</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <h4> {{ room.jihoz_nomi }} ni xonani o'chirishni xoxlaysizmi?</h4>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Yo'q</button>
                          <button type="button" class="btn btn-primary" @click="deleteRoom(room.id)" data-bs-dismiss="modal">Ha</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Okay modal -->
                  <div class="modal fade "
                       :class="{'d-block show': okayModalShow === true}"
                       data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" >Buyurtmani tasdiqlash</h1>
                          <button type="button" @click="okayModalShow = false" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <ul class="">
                            <li>{{ okayModalContent.kmt_ismi }}</li>
                            <li>{{ okayModalContent.hona_nomi }} - {{okayModalContent.hona_raqami}}</li>
                            <li>{{okayModalContent.jihoz_nomi}} - {{okayModalContent.buyutma_soni}}</li>
                          </ul>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" @click="okayModalShow = false" data-bs-dismiss="modal">Yo'q</button>
                          <button type="button" class="btn btn-primary"  @click="buyurtmaOkay(room)">Ha</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!--  Cancel modal       -->
                  <div class="modal fade "
                       :class="{'d-block show': cancelModalShow === true}"
                       data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5"> Buyurtmani bekor qilish </h1>
                          <button type="button" @click="toggleCancelModal(room)" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <ul class="">
                            <li>{{ room.kmt_ismi }}</li>
                            <li>{{ room.hona_nomi }} - {{room.hona_raqami}}</li>
                            <li>{{ room.jihoz_nomi }} - {{room.buyutma_soni}}</li>
                          </ul>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" @click="toggleCancelModal(room)" data-bs-dismiss="modal">Yo'q</button>
                          <button type="button" class="btn btn-primary"  @click="buyurtCancel(room)">Ha</button>
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