<script>
    import { useForm, Hint, HintGroup, validators, required, minLength, email } from "svelte-use-form";
    import { passwordMatch, containNumbers } from "./test.js";

    let mail ='';
    let password = '';
    let username = '';
    let passwordConfirm = '';
    const requiredMessage = "This field is required";
    const form = useForm();

    async function doPost () {
        console.log(mail, password);
        const res = await fetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify({
                email: mail,
                username: username,
                password: password,
                passwordConfirm: passwordConfirm
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        const data = await res.json();
        console.log(data);
    }
    //(async () => {
        //const response = await fetch(`http://localhost:8080/about.json`);
        //const data = await response.json();
        //console.log(data);
    //})();
</script>

<main>
    <form use:form style="display: flex; flex-direction: column">
        <h1>
            Registration
        </h1>
        <label for="email">Email</label>
        <input bind:value={mail} type="email" name="email" id="email" use:validators={[required, email]}/>
        <HintGroup for="email">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="email" hideWhenRequired>This must be a valid email</Hint>
        </HintGroup>

        <label for="name">Username</label>
        <input bind:value={username} type="text" id="name" name="name"/>

        <label for="password">Password</label>
        <input bind:value={password} type="password" id="password" name="password" use:validators={[required, minLength(5), containNumbers(2)]}/>
        <HintGroup for="password">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="minLength" hideWhenRequired let:value>This field must have at least {value} characters.</Hint>
            <Hint on="containNumbers" hideWhen="minLength" let:value>
                This field must contain at least {value} numbers.
            </Hint>
        </HintGroup>

        <label for="passwordConfirmation">Password Confirmation</label>
        <input bind:value={passwordConfirm} type="password" id="passwordConfirmation" name="passwordConfirmation" use:validators={[required, passwordMatch]}/>
        <HintGroup for="passwordConfirmation">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="passwordMatch" hideWhenRequired>Passwords do not match</Hint>
        </HintGroup><br />

        <button on:click={(e) => {
        e.preventDefault();
        doPost();
        window.location.href = '/main_page';
        console.log(mail);
        console.log(password);
       }} disabled={!$form.valid} on:click|preventDefault >Submit</button>
    </form>
</main>

<style>
    :global(.touched:invalid) {
        border-color: red;
        outline-color: red;
    }
    main {
        display: flex;
        justify-content: space-around;
    }
    pre {
        height: 80vh;
        overflow: auto;
        font-size: 12px;
    }
</style>