import React from 'react'

import Avatar from 'img/ab-avatar.png'

const CreateNewContact = ({ goToCreateForm }) => {
  return (
    <div
      style={{
        width: '411px',
        height: '486px',
        'box-shadow': 'inset 8px 0 10px -6px rgba(0, 0, 0, 0.16)'
      }}
      className="flex flex-col items-center justify-center"
    >
      <img className="w-22 h-22" src={Avatar} alt="avatar" />
      <h1 className="font-semibold text-success text-base my-7">Create New Contact</h1>
      <button
        onClick={goToCreateForm}
        className="rounded-sm shadow-md text-center text-indigo bg-trueGray-100 text-sm"
        style={{ width: '238px', height: '38px' }}
      >
        Enter Info Manually
      </button>
    </div>
  )
}

export default CreateNewContact
