import React from 'react';
import { Formik, Field, Form } from 'formik';
import { useLocation } from 'wouter';
import axios from 'axios';

// make all functions in yup available in the `Yup` object
import * as Yup from 'yup';

// import the hook from the flash message store
import { useFlashMessage } from './FlashMessageStore';

function RegisterPage() {

  // location: the current URL displayed in the browser window
  const [, setLocation] = useLocation();
  // extract the showMessage function 
  const { showMessage } = useFlashMessage();


  // create a validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(4, 'Password must be at least 4 characters long').required("Please enter a password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match"),
    salutation: Yup.string().required("Salutation is required")

  })

  // initialValues will contain the default value for each form
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    salutation: '',
    marketingPreferences: [],
    country: 'sg'
  }

  // event handler that will be called automatically by Formik
  // when the user submits the form
  const handleSubmit = async (values, formikHelpers) => {
    try {
      console.log(values);

      // register the user
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, values);
      console.log(response.data);
      showMessage("Registration is successful", "success");
      setLocation('/');


 
    } catch (e) {
      console.log(e);
      showMessage("Error registering", 'danger');
    }

  }

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <p>This is where users can create a new account.</p>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {
          /* populate the form with the form controls */
          (formik) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <Field
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                />
                {formik.errors.name && formik.touched.name ? <div className="text-danger">{formik.errors.name}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                />
                {formik.errors.email && formik.touched.email ? <div className="text-danger">{formik.errors.email}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <Field
                  type="password"
                  className="form-control"
                  id="email"
                  name="password"
                />
                {formik.errors.password && formik.touched.password ? <div className="text-danger">{formik.errors.password}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <Field
                  type="password"
                  className="form-control"
                  id="email"
                  name="confirmPassword"
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword ? <div className="text-danger">{formik.errors.confirmPassword}</div> : null}
              </div>


              <div className="mb-3">
                <label className="form-label">Salutation</label>
                <div>
                  <div className="form-check form-check-inline">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="salutation"
                      value="Mr"
                    />
                    <label className="form-check-label">
                      Mr.
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="salutation"
                      value="Ms"
                    />
                    <label className="form-check-label">
                      Ms.
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="salutation"
                      value="Mrs"
                    />
                    <label className="form-check-label">
                      Mrs.
                    </label>
                  </div>
                </div>
                {formik.errors.salutation && formik.touched.salutation ? <div className="text-danger">{formik.errors.salutation}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Marketing Preferences</label>
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="emailMarketing"
                    name="marketingPreferences"
                    value="email"
                  />
                  <label className="form-check-label" htmlFor="emailMarketing">
                    Email Marketing
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="smsMarketing"
                    name="marketingPreferences"
                    value="sms"
                  />
                  <label className="form-check-label" htmlFor="smsMarketing">
                    SMS Marketing
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label>Country</label>
                <Field
                  as="select"
                  className="form-select"
                  name="country">

                  <option value="">Select Country</option>
                  <option value="sg">Singapore</option>
                  <option value="my">Malaysia</option>
                  <option value="in">Indonesia</option>
                  <option value="th">Thailand</option>

                </Field>
              </div>

              <button type="submit"
                className="btn btn-primary">Register</button>

            </Form>


          )
        }
      </Formik>
    </div>
  );
}

export default RegisterPage;
