<script>
import {email, helpers, maxLength, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useToast} from "vue-toastification";
import axios from "axios";
import {mapActions} from "vuex";

export default {
  name: "login",
  data() {
    return {
      showPassword: false,
      user: {
        login: '',
        parol: ''
      }
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    errorToast() {
      this.toast.error("Login yoki parol xato", {
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

    async loginFunction() {

      this.v$.user.$touch();
      if (this.v$.user.$invalid) {
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
        const result = await axios.post('login', this.user, cfg);
        if (result.data.status === true) {
          const getUser = await axios.get(`https://zoyirbek.pro/api/odamlar.php?login=${this.user.login}&token=${result.data.token}`);
          if (getUser.status === 200) {
            const lokalUser = {
              id: getUser.data.data.id,
              ism: getUser.data.data.ism,
              familiya: getUser.data.data.familiya,
              kasblar_id: getUser.data.data.kasblar_id,
              login: getUser.data.data.login,
              token: getUser.data.data.token
            };
            localStorage.setItem('lokalUser', JSON.stringify(lokalUser));
            this.$router.push('/')
          }
        } else {
          this.errorToast();
        }
      } catch (e) {
        this.errorToast();
        console.error(e.message);
      }

    }
  },
  validations: {
    user: {
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
  },
  setup() {
    const v$ = useVuelidate();
    const toast = useToast();
    return {v$, toast}
  },
}
</script>

<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <!-- Register -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="text-center mb-2">
              <img class="logo__img" src="/public/isma_university_emblem.png" alt="">
              <span style="margin-left: 5px; font-size: 1.5rem; color: #566A7F; font-weight: 600;">ISMA University</span>
            </div>
            <!-- /Logo -->
              <div class="mb-3">
                <label for="email" class="form-label">Elektron pochta</label>
                <input type="text" class="form-control" id="email" name="email-username"
                       v-model="user.login"
                       :class="{'invalid-input': v$.user.login.$error}"
                       placeholder="Enter your email or username" autofocus
                       />
                <div v-if="v$.user.login.$error" class="invalid-input-text">
                  {{ v$.user.login.$errors[0].$message }}
                </div>
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Parol</label>

                </div>
                <div class="input-group input-group-merge">
                  <input v-model="user.parol" :type="showPassword ? 'text' : 'password'"
                         id="password" class="form-control" name="password"
                         placeholder="******" aria-describedby="password"
                         :class="{'invalid-input-password': v$.user.parol.$error}"/>
                  <span @click="togglePasswordVisibility" class="input-group-text cursor-pointer">
                    <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </span>
                  <div v-if="v$.user.parol.$error" class="invalid-input-text">
                    {{ v$.user.parol.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <button @click="loginFunction" class="btn btn-primary d-grid w-100" type="submit">Kirish</button>
              </div>

            <p class="text-center">
              <span class="me-2">Akkauntingiz yo'qmi?</span>
              <router-link to="/auth/register" href="auth-register-basic.html">
                <span>Ro'yhatdan o'ting</span>
              </router-link>
            </p>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>