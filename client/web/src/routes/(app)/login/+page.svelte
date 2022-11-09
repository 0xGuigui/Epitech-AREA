<script>
    import config from "../../../config.js"
    import {createForm} from "svelte-forms-lib";
    import {loggedIn, accessToken} from "../../../store.ts";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";

    let errs = {};
    async function logUser(form) {
        const response = await fetch(`${config.serverUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        const json = await response.json()
        return {
            status: response.status,
            ...json
        }
    }
    const {form, errors, handleChange, handleSubmit} = createForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: values => {
            if (values.email === "") {
                errs["email"] = "Email is required";
            }
            if (values.password === "") {
                errs["password"] = "Password is required";
            }
            return errs;
        },
        onSubmit: async values => {
            const response = await logUser(values);
            if (response.status === 401) {
                errs["email"] = "Email or password is invalid";
            } else {
                loggedIn.set(true);
                accessToken.set(response.token);
                await goto($page.url.searchParams.get("redirect-url") || "/");
            }
        }
    });
</script>

<section class="h-[100vh] w-[100vw] area-fade2 flex justify-center items-center">
    <div
        data-aos="fade-up"
        class="shadow-2xl w-[350px] h-[500px] backdrop-blur-sm bg-white/30 rounded-3xl">
        <form class="flex flex-col justify-center items-center h-full" on:submit={handleSubmit}>
            <h1 class="flex my-5 justify-center text-4xl font-bold text-white">Login</h1>
                <div class="">
                    <label class="block font-bold text-white" for="email">Email</label>
                    <input class="rounded focus:ring-2 focus:outline-none focus:ring-area-header px-1"
                            id="email"
                            name="email"
                            on:change={handleChange}
                            bind:value={$form.email}
                    />
                    {#if $errors.email}
                        <small data-aos="fade-right" data-aos-duration="500" class="block flex justify-center text-red-600 font-semibold">{$errors.email}</small>
                    {/if}
                </div>
                <div class="my-5">
                    <label class="block font-bold text-white" for="password">Password</label>
                    <input class="rounded focus:ring-2 focus:outline-none focus:ring-area-header px-1"
                            id="password"
                            name="password"
                            on:change={handleChange}
                            bind:value={$form.password}
                            type="password"
                    />
                    {#if $errors.password}
                        <small data-aos="fade-right" data-aos-duration="500" class="block flex justify-center text-red-600 font-semibold">{$errors.password}</small>
                    {/if}
                    <a class="block flex justify-center my-0.5 font-bold text-area-header hover:underline" href="/">Forgot password</a>
                </div>
            <button class="font-bold my-5 mr-2 py-2 px-6 bg-area-button hover:bg-area-header hover:scale-110 transition-all duration-150 rounded-lg text-white" type="submit">Submit</button>
        </form>
    </div>
</section>