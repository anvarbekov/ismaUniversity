<script>
export default {
  name: "sidebard",
  data() {
    return{
    lokalUser: {
      id: "0",
      ism: "",
      familiya: "",
      kasblar_id: "",
      login: "",
      token: ""
    },
    }
  },
  mounted() {
    let storage = JSON.parse(localStorage.getItem('lokalUser'));
    this.lokalUser = storage;
  }
}
</script>

<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
      <router-link to="/"  class="app-brand-link">
        <img class="logo__img" src="/public/isma_university_emblem.png" alt="">
        <span style="margin-left: 5px; font-size: 1rem; color: #566A7F; font-weight: 600;">ISMA University</span>
      </router-link>

    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
      <!-- Dashboard -->
      <li class="menu-item" :class="this.$route.name === 'dashboard' ? 'active':''">
        <router-link to="/" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Dashboard</div>
        </router-link>
      </li>

      <!-- Layouts -->
      <li v-if="lokalUser.kasblar_id == '1'" class="menu-item" :class="this.$route.name === 'rooms' ? 'active':''">
        <router-link to="/rooms"  class="menu-link menu-toggle">
          <i class="menu-icon tf-icons bx bx-layout"></i>
          <div data-i18n="Layouts">Rooms</div>
        </router-link>
      </li>
      <li v-if="lokalUser.kasblar_id != '1'" class="menu-item" :class="this.$route.name === 'furniture' ? 'active':''">
        <router-link to="/furniture"  class="menu-link menu-toggle">
          <i class="menu-icon tf-icons bx bx-layout"></i>
          <div data-i18n="Layouts">Furnitures</div>
        </router-link>
      </li>
      <li v-if="lokalUser.kasblar_id == '1'" class="menu-item" :class="this.$route.name === 'orders' ? 'active':''">
        <router-link to="/orders"  class="menu-link menu-toggle">
          <i class="menu-icon tf-icons bx bx-layout"></i>
          <div data-i18n="Layouts">Orders</div>
        </router-link>
      </li>
      <li v-if="lokalUser.kasblar_id == '2'" class="menu-item" :class="this.$route.name === 'ordersAccountant' ? 'active':''">
        <router-link to="/orders-accountant"  class="menu-link menu-toggle">
          <i class="menu-icon tf-icons bx bx-layout"></i>
          <div data-i18n="Layouts">Orders</div>
        </router-link>
      </li>
      <li v-if="lokalUser.kasblar_id != '1'" class="menu-item" :class="this.$route.name === 'ordersWarehouse' ? 'active':''">
        <router-link to="/orders-warehouse"  class="menu-link menu-toggle">
          <i class="menu-icon tf-icons bx bx-layout"></i>
          <div data-i18n="Layouts">Orders</div>
        </router-link>
      </li>

    </ul>
  </aside>
</template>

<style scoped>

</style>