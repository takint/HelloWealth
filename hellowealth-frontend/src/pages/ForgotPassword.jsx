import { useState } from 'react'
import { Formik } from 'formik'
import { Form } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ErrorMsg, FormGroup, FormInput } from '../styles/global.styles'
import { dynamicValidation } from '../services/helper'

export const ForgotPasswordPage = ({ pageHeader, errorMessage }) => {
  const [isFormSubmit, setFormSubmit] = useState()
  const [formError, setFormError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schema = dynamicValidation([
    {
      name: 'email',
      required: true,
      type: 'text',
      label: 'Enter your registered Email',
    },
  ])

  const handleSubmit = async (values, setFieldError) => {
    setLoading(true)
    setFormError(false)

    // TODO: call reset password from BE
    const response = { ok: false }

    if (response.ok) {
      setLoading(false)
      setSuccess(true)
    } else {
      setFormError(true)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-lg'>
      <h2 className='uppercase text-4xl my-4'>{pageHeader}</h2>
      <Formik
        validationSchema={schema}
        initialValues={{ email: '' }}
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
              {formError && <ErrorMsg>{errorMessage}</ErrorMsg>}
              <FormGroup>
                <label>Enter your registered Email</label>
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
                  {success
                    ? 'Sent!'
                    : loading
                    ? 'Submiting...'
                    : 'Send reset password link'}
                </button>
              </FormGroup>
            </Form>
            <div className='flex justify-between p-2 font-display'>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Back to Log In</Link>
            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

ForgotPasswordPage.defaultProps = {
  pageHeader: 'Forgot Your Password?',
  errorMessage:
    'Sorry, unable to send reset password link to the email provided.',
}

export default ForgotPasswordPage
