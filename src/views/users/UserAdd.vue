<template>
  <v-container fluid>
    <Loading :value="dialog"></Loading>
    <template v-if="!user">
      <v-alert :value="true" type="warning">Please login to add users!</v-alert>
    </template>
    <template>
      <div class="mb-4">
        <template v-if="invitationResponse">
          <v-alert
            v-if="invitationResponse.error"
            :value="true"
            type="error"
          >{{ invitationResponse.code }} {{ invitationResponse.message }}</v-alert>
          <v-alert v-else :value="true" type="success">
            User creation: <strong>OK</strong> - {{ invitationResponse.invitedUserDisplayName }} - ID {{ invitationResponse.invitedUser.id }}
          </v-alert>
          <!-- <pre v-if="invitationResponse">{{ JSON.stringify(invitationResponse, null, 4) }}</pre> -->
          <!--           <pre>
<strong>invitedUserDisplayName:</strong>
{{ invitationResponse.invitedUserDisplayName }}
<strong>inviteRedeemUrl:</strong>
{{ invitationResponse.inviteRedeemUrl }}
<strong>invitedUserEmailAddress:</strong>
{{ invitationResponse.invitedUserEmailAddress }}
<strong>invitedUser.id:</strong>
{{ invitationResponse.invitedUser.id }}
<strong>sendInvitationMessage:</strong>
{{ invitationResponse.sendInvitationMessage }}
          </pre>-->
        </template>
        <template v-if="userToBeAdded">
          <v-alert v-if="addToGroupResponse" :value="true" type="error">
            User addition to group: <strong>KO</strong> -
            {{ addToGroupResponse.json().error.code }}, {{ addToGroupResponse.json().error.message }}
          </v-alert>
          <v-alert v-else :value="true" type="success">User addition to group: <strong>OK</strong></v-alert>

          <v-alert v-if="updateUserResponse" :value="true" type="error">
            Update user first name and surname: <strong>KO</strong> -
            {{ updateUserResponse.json().error.code }}, {{ updateUserResponse.json().error.message }}
          </v-alert>
          <v-alert v-else :value="true" type="success">User attributes update: <strong>OK</strong></v-alert>

          <!-- <pre v-if="addToGroupResponse">
{{ JSON.stringify(addToGroupResponse, null, 4) }}
          </pre>-->
        </template>
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
                <v-text-field v-model="newUserInfo.phone" :rules="phoneRules" label="Mobile phone"></v-text-field>
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
      addToGroupResponse: false,
      updateUserResponse: false,
      userToBeAdded: false,
      userInfo: false,
      valid: true,
      nameRules: [v => !!v || "Name is required"],
      lastRules: [v => !!v || "Name is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      phoneRules: [
        v =>
          /^(\s*|[+]{1}[0-9]{1,3}[0-9]{9,10})$/.test(v) ||
          "Phone must start with country code and contain only numbers"
      ]
    };
  },
  computed: {
    invitationInfo() {
      return {
        invitedUserEmailAddress: this.newUserInfo.email,
        inviteRedirectUrl: "https://chiesi-dev.exomtrials.com/",
        invitedUserDisplayName: `${this.newUserInfo.first} ${
          this.newUserInfo.last
        }`,
        sendInvitationMessage: false,
        invitedUserMessageInfo: {
          customizedMessageBody:
            "Dear user, you can login to TRITRIAL Study Portal here: https://chiesi-dev.exomtrials.com"
          /* messageLanguage: "it-IT" */
        }
      };
    },
    userPropertiesToUpdate() {
      if (this.newUserInfo.phone) {
        return {
          givenName: this.newUserInfo.first,
          surName: this.newUserInfo.last,
          mobilePhone: this.newUserInfo.phone
        };
      } else {
        return {
          givenName: this.newUserInfo.first,
          surName: this.newUserInfo.last
        };
      }
    }
  },
  created() {
    this.setUser();
  },
  methods: {
    sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    reset() {
      this.$refs.form.reset();
      this.invitationResponse = false;
      this.addToGroupResponse = false;
      this.updateUserResponse = false;
      this.userToBeAdded = false;
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
                  this.userToBeAdded = this.invitationResponse.invitedUser.id;

                  this.$AuthService
                    .addUserToGroup(
                      token,
                      JSON.stringify({
                        "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${
                          this.userToBeAdded
                        }`
                      })
                    )
                    .then(
                      data => {
                        this.addToGroupResponse = data;
                        this.dialog = false;
                      },
                      error => {
                        console.error(error);
                        this.apiCallFailed = true;
                        this.dialog = false;
                      }
                    );

                  this.$AuthService
                    .updateUser(
                      token,
                      this.userToBeAdded,
                      JSON.stringify(this.userPropertiesToUpdate)
                    )
                    .then(
                      data => {
                        this.updateUserResponse = data;
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
          },
          error => {
            console.error(error);
            this.apiCallFailed = true;
            this.dialog = false;
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
