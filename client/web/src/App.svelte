<script>
  import { Router, Link, Route } from "svelte-routing";
  import Login from "./login_page.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <div>
    <Route path="login" component="{Login}" />
    <Route path="/">
        <h1>Welcome to AREA</h1>
        <Link to="login">Login</Link>
    </Route>
  </div>
</Router>