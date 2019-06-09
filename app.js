Vue.use(vuelidate.default);

//VALIDATORS
const pizzaOrBurguer = value =>
  value === "pizza" || value === "burguer" || !validators.helpers.req(value);
const oldEnoughAndAlive = validators.between(12, 120);

new Vue({
  el: "#app",

  data() {
    return {
      form: {
        name: null,
        age: null,
        email: null,
        food: null,
        newsletter: null,
        githubUsername: null
      }
    };
  },

  validations: {
    form: {
      name: {
        required: validators.required
      },
      age: {
        required: validators.required,
        integer: validators.integer,
        oldEnoughAndAlive
      },
      githubUsername: {
        exists(value) {
          //If is empty
          if (!validators.helpers.req(value)) {
            return true;
          }

          return axios.get(`//api.github.com/users/${value}`);
        }
      },
      email: {
        email: validators.email,
        required: validators.requiredIf(function() {
          return !!this.form.newsletter;
        })
      },
      food: {
        pizzaOrBurguer
      }
    }
  },

  methods: {
    shouldAppendValidClass(field) {
      return !field.$invalid && field.$model && field.$dirty;
    },
    shouldAppendErrorClass(field) {
      return field.$error;
    },

    submitForm() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log("Form Submitted", this.form);
      } else {
        console.log("Invalid form");
      }
    }
  }
});
