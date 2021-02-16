import { useState } from 'react'
import { Formik } from 'formik'
import { Form } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ErrorMsg, FormGroup, FormInput } from '../styles/global.styles'
import { login } from '../services/api'
import { dynamicValidation } from '../services/helper'

export const RegisterPage = ({ pageHeader, errorMessage }) => {
  const [isFormSubmit, setFormSubmit] = useState()
  const [registerError, setRegisterError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schema = dynamicValidation([
    { name: 'firstName', type: 'text', label: 'First Name' },
    { name: 'lastName', type: 'text', label: 'Last Name' },
    { name: 'email', required: true, type: 'text', label: 'Email' },
    { name: 'password', required: true, label: 'Password' },
    { name: 'confirmPassword', required: true, label: 'Confirm Password' },
  ])

  const handleSubmit = async (values, setFieldError) => {
    setLoading(true)
    setRegisterError(false)

    const response = await login(values.email, values.password)

    if (response.user) {
      // TODO: redirect to login

      setLoading(false)
      setSuccess(true)
      //Router.pushRoute('/portfolio')
    } else {
      setRegisterError(true)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-lg'>
      <h2 className='uppercase text-4xl my-4'>{pageHeader}</h2>
      <Formik
        validationSchema={schema}
        initialValues={{}}
        onSubmit={(values, { setFieldError }) => {
          handleSubmit(values, setFieldError)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className='w-full lg:w-1/2'>
            <Form>
              {registerError && <ErrorMsg>{errorMessage}</ErrorMsg>}
              <FormGroup>
                <label>First Name</label>
                <FormInput
                  type='text'
                  name='firstName'
                  id='firstName'
                  placeholder='John'
                  value={values.email}
                  invalid={isFormSubmit && errors['firstName']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['firstName']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Last Name</label>
                <FormInput
                  type='text'
                  name='lastName'
                  id='lastName'
                  placeholder='Wick'
                  value={values.email}
                  invalid={isFormSubmit && errors['lastName']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['lastName']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Your Email</label>
                <FormInput
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Enter your email'
                  value={values.email}
                  invalid={isFormSubmit && errors['email']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['email']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Password</label>
                <FormInput
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Enter your password'
                  value={values.password}
                  invalid={isFormSubmit && errors['password']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['password']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Confirm Password</label>
                <FormInput
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  placeholder='Re-enter your password'
                  value={values.password}
                  invalid={isFormSubmit && errors['confirmPassword']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && (
                  <ErrorMsg>{errors['confirmPassword']}</ErrorMsg>
                )}
              </FormGroup>
              <FormGroup>
                <button
                  type='submit'
                  className='bg-blue__medium text-white h-12'
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault()
                    setFormSubmit(true)
                    handleSubmit()
                  }}
                >
                  {success ? 'Success!' : loading ? 'Submiting...' : 'Sign Up'}
                </button>
              </FormGroup>
            </Form>
            <div className='flex justify-between p-2 font-display'>
              <Link to='/login'>Log In</Link>
            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

RegisterPage.defaultProps = {
  pageHeader: 'Register',
  errorMessage: 'Sorry, please input valid information.',
}

export default RegisterPage
