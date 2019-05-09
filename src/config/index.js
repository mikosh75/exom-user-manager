export default {
  // clientid: "fd621b25-165a-4284-9ba0-b9518b76e94a", msnetpro
  clientid: "a32a5f35-c2ce-4a79-8f9c-fed21bae7f49",
  redirecturl: "http://localhost:8080/exom-user-manager",
  // authority: 'https://login.microsoftonline.com/adf2a433-a1e8-459f-8692-a8941c5be110', // msnetpro
  authority:
    "https://login.microsoftonline.com/c261ec17-d65f-4219-ad99-d4fa5ceb2ec2", // exom directory
  graphscopes: ["user.read"],
  graphendpoint: "https://graph.microsoft.com/v1.0/me",
  graphendpointinvitation: "https://graph.microsoft.com/v1.0/invitations",
  graphendpointupdateuser: "https://graph.microsoft.com/v1.0/users",
  graphendpointaddusertogroup:
    "https://graph.microsoft.com/v1.0/groups/044532dc-a224-4744-8e68-70dc06d29811/members/$ref",
  appinsightsid: ""
};
