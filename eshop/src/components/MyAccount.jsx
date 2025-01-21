import { useFormik } from "formik";

export function MyAccount() {
  const savedAddress = JSON.parse(localStorage.getItem("customer_address")) || {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  
  function validateBilling(formData) {
    var errors = {};
    if (formData.firstName === "") {
      errors.firstName = "First Name should not blank!";
    } else if (formData.lastName === "") {
      errors.lastName = "Last Name should not blank!";
    } else if (formData.email === "") {
      errors.email = "Email should not blank!";
    } else if (formData.address === "") {
      errors.address = "Address should not blank!";
    } else if (formData.city === "") {
      errors.city = "City should not blank!";
    } else if (formData.state === "") {
      errors.state = "State should not blank!";
    } else if (formData.zip === "") {
      errors.zip = "Zip should not blank!";
    } else if (formData.country === "") {
      errors.country = "Country should not blank!";
    }
  }


  const formik = useFormik({
    initialValues: {
      ...savedAddress,
    },
    validate: validateBilling,
    onSubmit: (userData) => {
      localStorage.setItem("customer_address", JSON.stringify(userData));
    },
    enableReinitialize: true
  });
  return (
    <main className="container m-auto">
      <h1 className="text-center my-5">My Profile</h1>
        <form className="needs-validation my-5 px-3" onSubmit={formik.handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                    />

                    {formik.errors.firstName && (
                      <div className="text-danger">
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      required=""
                    />

                    {formik.errors.lastName && (
                      <div className="text-danger">
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email{" "}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    {formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      required=""
                    />
                    {formik.errors.address && (
                      <div className="text-danger">{formik.errors.address}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      required=""
                    />
                    {formik.errors.city && (
                      <div className="text-danger">{formik.errors.city}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.state && (
                      <div className="text-danger">{formik.errors.state}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="zip" className="form-label">
                      Zip
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zip"
                      value={formik.values.zip}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.zip && (
                      <div className="text-danger">{formik.errors.zip}</div>
                    )}
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      className="form-select"
                      name="country"
                      id="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                    >
                       <option value="">-- Select --</option>                      
                      <option value="AU">Australia</option>
                      <option value="CA">Canada</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {formik.errors.country && (
                      <div className="text-danger">
                        Please select a valid country.
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn d-inline-block btn-lg btn-dark my-5 col-10 col-md-4 m-auto">
                    <i className="bi bi-save"></i> Update 
                    </button>
                </div>
              </form>
    </main>
  );
}
