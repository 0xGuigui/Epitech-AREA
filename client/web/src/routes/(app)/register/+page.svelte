<script>
    import {createForm} from "svelte-forms-lib";

    let errs = {};

    async function logUser(form) {
        const response = await fetch(`test/register`, {
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
    localStorage.setItem('JWT_tokens', JSON.stringify('value'));
    const {form, errors, handleChange, handleSubmit} = createForm({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        },
        validate: values => {
            if (values.email === "") {
                errs["email"] = "Email is required";
            }
            if (values.username === "") {
                errs["username"] = "Username is required";
            }
            if (values.password === "") {
                errs["password"] = "Password is required";
            }
            if (values.confirmPassword === "") {
                errs["confirmPassword"] = "Confirm your password";
            }
            return errs;
        },
        onSubmit: async values => {
            const response = await logUser(values);
            if (response.status === 401)
                errs["email"] = "Email or password is invalid";
            else
                window.location="/";
            console.log(response);
        }
    });
</script>

<section class="h-[100vh] w-[100vw] flex justify-center items-center">
    <div data-aos="fade-up"
         class="shadow-2xl w-[400px] h-[600px] backdrop-blur-sm bg-white/30 rounded-3xl">
        <form class="flex flex-col justify-center items-center h-full" on:submit={handleSubmit}>
            <h1 class="flex my-5 justify-center text-4xl font-bold text-white">Register</h1>
            <div class="">
                <label class="block font-bold text-white" for="username">Username</label>
                <input class="rounded focus:ring-2 focus:outline-none focus:ring-area-header px-1"
                       id="username"
                       name="username"
                       on:change={handleChange}
                       bind:value={$form.username}
                />
                {#if $errors.username}
                    <small data-aos="fade-right" data-aos-duration="500" class="block flex justify-center text-red-600 font-semibold">{$errors.username}</small>
                {/if}
            </div>
            <div class="my-5">
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
                <div class="">
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
                </div>
                <div class="my-5">
                    <label class="block font-bold text-white" for="confirmPassword">Confirm Password</label>
                    <input class="rounded focus:ring-2 focus:outline-none focus:ring-area-header px-1"
                           id="confirmPassword"
                           name="confirmPassword"
                           on:change={handleChange}
                           bind:value={$form.confirmPassword}
                           type="password"
                    />
                    {#if $errors.confirmPassword}
                        <small data-aos="fade-right" data-aos-duration="500" class="block flex justify-center text-red-600 font-semibold">{$errors.confirmPassword}</small>
                    {/if}
                </div>
            <button class="flex font-bold justify-center my-7 w-64 h-14 hover:bg-area-header bg-gray-500 text-white rounded-xl hover:scale-105 transition-all items-center" type="submit">Submit</button>
        </form>
    </div>
</section>