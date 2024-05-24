<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";
import {email, helpers, maxLength, minLength, required} from "@vuelidate/validators";

export default {
  name: "register",
  data() {
    return {
      auth: {
        ism: "",
        familiya: "Familiya",
        login: "",
        parol: "",
        kasblar_id: 1
      },
      jobsList: [],
      isJobsLoaded: false,
      showPassword: false,
      toasts: []
    }
  },
  setup() {
    const v$ = useVuelidate();
    const toast = useToast();
    return {v$, toast}
  },
  methods: {
    successToast() {
      this.toast.success("Muvaffaqiyatlik ro'yhatdan o'tdingiz", {
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
    async fetchJobs() {
      try {
        let result = await axios.get('kasblar.php');
        if (result.status === 200) {
          this.jobsList = result.data.data;
          this.isJobsLoaded = true;
          console.log(this.jobsList)
        }
      } catch (e) {
        console.error(e.message)
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async registerUser() {
      this.v$.auth.$touch();
      if (this.v$.auth.$invalid) {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        return;
      }
      const cfg = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      try {
        const result = await axios.post('register.php',this.auth, cfg );
        if (result.status === 200) {
          this.successToast();
          this.$router.push('/auth/login');
        }
      } catch (e) {
        console.error(e.message);
        this.errorToast();
      }
    }
  },
  async mounted() {
    await this.fetchJobs();
  },
  validations: {
    auth: {
      ism: {
        required: helpers.withMessage('Yozilishi shart', required),
        minLength: helpers.withMessage('3 ta belgidan ko\'p  bo\'lishi kerak', minLength(3)),
        maxLength: helpers.withMessage("100 ta belgidan kam bo'lishi kerak", maxLength(100))
      },
      login: {
        required: helpers.withMessage('Yozilishi shart', required),
        email: helpers.withMessage('Email manzilingiz noto\'g\'ri', email)
      },
      parol: {
        required: helpers.withMessage('Yozilishi shart', required),
        minLength: helpers.withMessage('3 ta belgidan ko\'p  bo\'lishi kerak', minLength(3)),
        maxLength: helpers.withMessage("100 ta belgidan kam bo'lishi kerak", maxLength(100))
      }
    }
  }
}
</script>

<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <!-- Register Card -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center">
              <a href="index.html" class="app-brand-link gap-2">
                  <span class="app-brand-logo demo">
                  </span>
                  <div class="text-center mb-2">
                    <img class="logo__img" src="/public/isma_university_emblem.png" alt="">
                    <span style="margin-left: 5px; font-size: 1.5rem; color: #566A7F; font-weight: 600;">ISMA University</span>
                  </div>
              </a>
            </div>
            <!-- /Logo -->

            <div class="mb-3 ">
              <label for="username" class="form-label">Full Name</label>

              <input v-model="auth.ism" type="text" class="form-control" id="username"
                     :class="{'invalid-input': v$.auth.ism.$error}"
                     name="username" placeholder="Your full name" autofocus/>

              <div v-if="v$.auth.ism.$error" class="invalid-input-text">
                {{ v$.auth.ism.$errors[0].$message }}
              </div>

            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="auth.login" type="email" class="form-control"
                     :class="{'invalid-input': v$.auth.login.$error}"
                     id="email" name="email" placeholder="example@mail.com"/>
              <div v-if="v$.auth.login.$error" class="invalid-input-text">
                {{ v$.auth.login.$errors[0].$message }}
              </div>
            </div>
            <div class="mb-3 form-password-toggle">
              <label class="form-label" for="password">Password</label>
              <div class="input-group input-group-merge">
                <input v-model="auth.parol" :type="showPassword ? 'text' : 'password'"
                       id="password" class="form-control" name="password"
                       placeholder="******" aria-describedby="password"
                       :class="{'invalid-input-password': v$.auth.parol.$error}"/>
                <span @click="togglePasswordVisibility" class="input-group-text cursor-pointer">
                    <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </span>
                <div v-if="v$.auth.parol.$error" class="invalid-input-text">
                  {{ v$.auth.parol.$errors[0].$message }}
                </div>
              </div>
            </div>
            <div class="mb-3" v-if="isJobsLoaded">
              <select class="form-select" aria-label="Default select example" v-model="auth.kasblar_id">
                <option selected disabled>Choose your job</option>
                <option v-for="job in jobsList" :value="job.id">{{ job.nomi }}</option>
              </select>
            </div>
            <button @click="registerUser" class="btn btn-primary d-grid w-100">Sign up</button>

          </div>
        <p class="text-center">
          <span class="me-2">If you have account go to </span>
          <router-link to="/auth/login" href="auth-register-basic.html">
            <span>Sign in</span>
          </router-link>
        </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>