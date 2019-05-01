<template>
  <v-container fluid>
    <template v-if="!user">
      <v-alert :value="true" type="warning">Please login to add users!</v-alert>
    </template>
    <pre v-if="invitationResponse">{{ JSON.stringify(invitationResponse, null, 4) }}</pre>
    <v-layout justify-center>
      <template v-if="user">
        <v-flex text-xs-center xs12 sm6>
          <v-card>
            <v-card-title primary-title>
              <div>
                <strong>Invite a new user</strong>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="newUserInfo.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newUserInfo.first"
                  :rules="nameRules"
                  label="First name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newUserInfo.last"
                  :rules="lastRules"
                  label="Last name"
                  required
                ></v-text-field>
                <v-text-field v-model="newUserInfo.phone" label="Mobile phone"></v-text-field>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  @click="invitationCall"
                  class="mr-2"
                >Submit</v-btn>
                <v-btn color="error" @click="reset">Reset</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
import usersData from "./UsersData";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "UserAdd",
  props: {
    caption: {
      type: String,
      default: "Users"
    },
    hover: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  mixins: [validationMixin],
  validations: {
    name: { required },
    last: { required },
    phone: { required },
    email: { required, email }
  },
  data: () => {
    return {
      user: null,
      newUserInfo: {
        email: "",
        first: "",
        last: "",
        phone: ""
      },
      apiCallFailed: false,
      invitationResponse: false,
      valid: true,
      nameRules: [v => !!v || "Name is required"],
      lastRules: [v => !!v || "Name is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
    invitationInfo() {
      return {
        invitedUserEmailAddress: this.newUserInfo.email,
        inviteRedirectUrl: "https://chiesi-dev.exomtrials.com/acm",
        invitedUserDisplayName: `${this.newUserInfo.first} ${
          this.newUserInfo.last
        }`,
        sendInvitationMessage: false
      };
    }
  },
  created() {
    this.setUser();
  },
  methods: {
    reset() {
      this.$refs.form.reset();
      this.invitationResponse = false;
    },
    getBadge(status) {
      return status === "Active"
        ? "success"
        : status === "Inactive"
        ? "secondary"
        : status === "Pending"
        ? "warning"
        : status === "Banned"
        ? "danger"
        : "primary";
    },
    getRowCount(items) {
      return items.length;
    },
    userLink(id) {
      return `users/${id.toString()}`;
    },
    rowClicked(item) {
      const userLink = this.userLink(item.id);
      this.$router.push({ path: userLink });
    },
    setUser() {
      this.user = this.$AuthService.getUser();
    },
    invitationCall() {
      if (this.$refs.form.validate()) {
        this.apiCallFailed = false;
        this.$AuthService.getGraphToken().then(
          token => {
            this.$AuthService
              .createGraphInvitation(token, JSON.stringify(this.invitationInfo))
              .then(
                data => {
                  this.invitationResponse = data;
                },
                error => {
                  console.error(error);
                  this.apiCallFailed = true;
                }
              );
          },
          error => {
            console.error(error);
            this.apiCallFailed = true;
          }
        );
      }
    }
  }
};
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
}
</style>
