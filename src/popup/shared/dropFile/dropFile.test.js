import '@babel/polyfill'
import { act, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import DropFile from '.'

describe('Test for DropFile component', () => {
  describe('Render without crashing', () => {
    let dropZone, importDescription, container, props, file, fileMock, setFileMock, inputEle

    beforeEach(() => {

      fileMock = {}
      setFileMock = jest.fn()

      props = {
        file: fileMock,
        setFile: setFileMock
      }

      const obj = render(<DropFile {...props} />)
      container = obj.container
      dropZone = container.getElementsByClassName('dropzone')[0]
      importDescription = container.getElementsByClassName('import-description')[0]
      file = new File(['Foo'], 'chucknorris.json', { type: 'json' })
      inputEle = screen.getByTestId('fileInput')
    })

    it('renders correctly', () => {
      expect(container).toMatchSnapshot()
    })
  })
})
