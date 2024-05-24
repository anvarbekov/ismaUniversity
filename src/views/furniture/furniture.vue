<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";

export default {
  name: "furniture",
  data() {
    return {
      furniture : {
        jihoz_nomi: '',
        soni: 0
      },
      furnitureList: []
    }
  },
  methods: {

    async getRooms() {
      this.furnitureList = []
      try {
        const result = await axios.get('ombor.php?token='+ this.lokalUser.token);
        if (result.status === 200) {
          this.furnitureList = result.data.data;
          console.log(result.data)
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
          this.furniture = {
            jihoz_nomi: '',
            soni: 0
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
        const result = await axios.get('delete?ombor&id=' + honaId +'&token='+ this.lokalUser.token);
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
      this.toast.success("muvaffaqiyatli yaratildi", {
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
      <h4 class="fw-bold py-3 mb-4"> Jihozlar </h4>

      <!-- Basic Bootstrap Table -->
      <!-- Bordered Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <h5 class="">Jihozlar</h5>
          <button type="button" class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRoomModal">
            Add furniture  </button>
        </div>
        <!--    add room modal-->

        <!-- Modal -->
        <div class="modal fade" id="addRoomModal" tabindex="-1" aria-labelledby="addRoomModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="addRoomModalLabel">Add furniture</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <label> furniture name </label>
                <input v-model="furniture.jihoz_nomi" type="text" class="form-control">
                <label> Quantity </label>
                <input v-model="furniture.soni" type="number" class="form-control">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button @click="createFurniture" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save</button>
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
                <th>Furniture name</th>
                <th>Furniture quantity</th>
                <th>Edit</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(room, index) in furnitureList" :key="index">
                <td>  {{ room.jihoz_nomi }} </td>
                <td>{{ room.soni }}</td>
                <td>
                  <button class="btn badge badge-center bg-danger" data-bs-toggle="modal" :data-bs-target="'#roomDeleteModal_' + index">
                    <i class="fa-solid fa-trash"></i>
                  </button>

                  <!-- Modal -->
                  <div class="modal fade" :id="'roomDeleteModal_' + index" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'roomDeleteModalLabel_' + index" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" :id="'roomDeleteModalLabel_' + index">Delete furniture</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <h4> Are you sure to delete</h4>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                          <button type="button" class="btn btn-primary" @click="deleteRoom(room.id)" data-bs-dismiss="modal">Yes</button>
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