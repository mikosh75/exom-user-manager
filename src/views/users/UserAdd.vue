<template>
  <v-container fluid>
    <Loading :value="dialog"></Loading>
    <template v-if="!user">
      <v-alert :value="true" type="warning">Please login to add users!</v-alert>
    </template>
    <template>
      <div class="mb-4">
        <!-- <pre v-if="invitationResponse">{{ JSON.stringify(invitationResponse, null, 4) }}</pre> -->
        <pre v-if="invitationResponse">
        <strong>invitedUserDisplayName:</strong>
        {{ invitationResponse.invitedUserDisplayName }}
        <strong>inviteRedeemUrl:</strong>
        {{ invitationResponse.inviteRedeemUrl }}
        <strong>invitedUserEmailAddress:</strong>
        {{ invitationResponse.invitedUserEmailAddress }}
        <strong>invitedUser.id:</strong>
        {{ invitationResponse.invitedUser.id }}
         </pre>
        <pre v-if="userInfo">{{ JSON.stringify(userInfo, null, 4) }}</pre>
      </div>
    </template>
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
                <v-btn color="warning" @click="callAPI" class="mr-2">Test</v-btn>
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
import Loading from "@/components/Loading";

export default {
  name: "UserAdd",
  components: {
    Loading
  },
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
  data: () => {
    return {
      dialog: false,
      user: null,
      newUserInfo: {
        email: "",
        first: "",
        last: "",
        phone: ""
      },
      apiCallFailed: false,
      invitationResponse: false,
      userInfo: false,
      valid: true,
      nameRules: [v => !!v || "Name is required"],
      lastRules: [v => !!v || "Name is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  watch: {
    dialog(val) {
      if (!val) return;
      setTimeout(() => (this.dialog = false), 4000);
    }
  },
  computed: {
    invitationInfo() {
      return {
        invitedUserEmailAddress: this.newUserInfo.email,
        inviteRedirectUrl: "https://chiesi-dev.exomtrials.com/",
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
      this.userInfo = false;
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
        this.dialog = true;
        this.apiCallFailed = false;
        this.$AuthService.getGraphToken().then(
          token => {
            this.$AuthService
              .createGraphInvitation(token, JSON.stringify(this.invitationInfo))
              .then(
                data => {
                  this.invitationResponse = data;
                  this.dialog = false;
                },
                error => {
                  console.error(error);
                  this.apiCallFailed = true;
                  this.dialog = false;
                }
              );
          },
          error => {
            console.error(error);
            this.apiCallFailed = true;
            this.dialog = false;
          }
        );
      }
    },
    callAPI() {
      this.dialog = true;
      this.apiCallFailed = false;
      this.$AuthService.getGraphToken().then(
        token => {
          this.$AuthService.getGraphUserInfo(token).then(
            data => {
              this.userInfo = data;
              this.dialog = false;
            },
            error => {
              console.error(error);
              this.apiCallFailed = true;
              this.dialog = false;
            }
          );
        },
        error => {
          console.error(error);
          this.apiCallFailed = true;
          this.dialog = false;
        }
      );
    }
  }
};
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
}
</style>
