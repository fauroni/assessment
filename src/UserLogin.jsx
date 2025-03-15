import React from 'react';
import { Formik, Form, Field, ErrorMessage, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import { useFlashMessage } from './FlashMessageStore';
import axios from 'axios';
import {useJwt} from "./UserStore";
import { useLocation } from 'wouter';

export default function UserLogin() {

    // React hooks must be at the top of the component function
    const {showMessage } = useFlashMessage();
    const { setJwt} = useJwt();
    const [, setLocation] = useLocation();

 

    // initial state for Formik
    const initialValues = {
        email: '',
        password: ''
    }

    const handleSubmit = async(values, formikHelper) =>{
        try {
            console.log(values);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/login`, values
            )
            console.log(response.data);
            setJwt(response.data.token);
            showMessage('Login successful', 'success');
            formikHelper.setSubmitting(false); // <-- indicate the form has finished submission
            setLocation("/");
        } catch (e) {
            console.error(e);
            showMessage("Unable to login", "error");
        }


    }

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address format').required("Please provide your email address"),
        password: Yup.string().required("Please provide your password")
    })

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {
                    function (formik) {
                        return (
                            <Form className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <Field type="email" id="email" name="email" className="form-control" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <Field type="password" id="password" name="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>

                                {formik.errors.submit && <div className="alert alert-danger">{formik.errors.submit}</div>}

                                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                                    {formik.isSubmitting ? 'Logging in...' : 'Login'}
                                </button>
                            </Form>
                        )
                    }
                }
            </Formik>
        </div>
    )
}