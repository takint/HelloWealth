import { useState, useContext, useEffect } from 'react'
import { Formik } from 'formik'
import { Form } from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import { ErrorMsg, FormGroup, FormInput } from '../styles/global.styles'
import { signUp, updateUser } from '../services/api'
import { UserContext } from '../services/context'
import { dynamicValidation, isNullOrEmpty } from '../services/helper'
import { setCookie, JWT_COOKIE } from '../services/cookies'

const initRegisterForm = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password1: '',
  password2: '',
}

export const RegisterPage = ({ pageHeader, errorMessage }) => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [isFormSubmit, setFormSubmit] = useState(false)
  const [registerError, setRegisterError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schema = dynamicValidation([
    { name: 'first_name', type: 'text', label: 'First Name' },
    { name: 'last_name', type: 'text', label: 'Last Name' },
    { name: 'username', type: 'text', label: 'Username' },
    { name: 'email', required: true, type: 'text', label: 'Email' },
    { name: 'password1', required: true, label: 'Password' },
    {
      name: 'password2',
      matched: 'password1',
      required: true,
      label: 'Confirm Password',
    },
  ])

  const handleSubmit = async (values, setFieldError) => {
    setLoading(true)
    setRegisterError(false)

    values.username = values.email
    const response = await signUp(values)

    if (response.ok && !isNullOrEmpty(response.user)) {
      setCookie(JWT_COOKIE, response.access_token)

      const newUser = {
        ...response.user,
        first_name: values.first_name,
        last_name: values.last_name,
      }

      // Update user info
      await updateUser(response.access_token, {
        pk: newUser.pk,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      })

      userContext.setContext({
        ...userContext,
        token: response.access_token,
        refresh_token: response.refresh_token,
        isAuthorized: true,
        userProfile: {
          userId: newUser.pk,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
        },
      })

      setLoading(false)
      setSuccess(true)
      history.push('/dashboard')
    } else {
      setRegisterError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    return function cleanup() {}
  })

  return (
    <div className='flex flex-1 flex-col justify-center items-center text-lg'>
      <h2 className='uppercase text-4xl my-4'>{pageHeader}</h2>
      <Formik
        validationSchema={schema}
        initialValues={initRegisterForm}
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
                  name='first_name'
                  id='firstName'
                  placeholder='John'
                  value={values.first_name}
                  invalid={isFormSubmit && errors['first_name']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['first_name']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Last Name</label>
                <FormInput
                  type='text'
                  name='last_name'
                  id='lastName'
                  placeholder='Wick'
                  value={values.last_name}
                  invalid={isFormSubmit && errors['last_name']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['last_name']}</ErrorMsg>}
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
                  name='password1'
                  id='password'
                  placeholder='Enter your password'
                  value={values.password1}
                  invalid={isFormSubmit && errors['password1']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['password1']}</ErrorMsg>}
              </FormGroup>
              <FormGroup>
                <label>Confirm Password</label>
                <FormInput
                  type='password'
                  name='password2'
                  id='confirmPassword'
                  placeholder='Re-enter your password'
                  value={values.password2}
                  invalid={isFormSubmit && errors['password2']}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                />
                {isFormSubmit && <ErrorMsg>{errors['password2']}</ErrorMsg>}
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
