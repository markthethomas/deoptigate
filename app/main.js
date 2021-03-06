'use strict'

const React = require('react')
const { Component } = React
const { render } = require('react-dom')
const { deoptigate } = require('../')

const { CodeView } = require('./components/code')
const { SummaryView } = require('./components/summary')
const { ToolbarView } = require('./components/toolbar')
const { FilesView } = require('./components/files')

function app() {
  // makes React happy
  document.body.innerHTML = ''
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

class MainView extends Component {
  constructor(props) {
    super(props)
    this.state = {
        selectedFile: null
      , selectedLocation: 2
      , includeAllSeverities: false
    }
    this._bind()
  }

  _bind() {
    this._onlocationSelected = this._onlocationSelected.bind(this)
    this._onincludeAllSeveritiesChanged = this._onincludeAllSeveritiesChanged.bind(this)
    this._onfileClicked = this._onfileClicked.bind(this)
  }

  render() {
    const { groups } = this.props
    const { selectedFile, includeAllSeverities } = this.state
    const fileDetailsClassName = 'flex flex-row justify-center ma2'
    const fileDetails = this._renderFileDetails(fileDetailsClassName)

    return (
      <div className='flex-column center mw9 pa2'>
        <ToolbarView
          className='flex flex-row justify-center'
          includeAllSeverities={includeAllSeverities}
          onincludeAllSeveritiesChanged={this._onincludeAllSeveritiesChanged} />
        <FilesView
          className='flex flex-row justify-center vh-15 overflow-scroll'
          selectedFile={selectedFile}
          groups={groups}
          includeAllSeverities={includeAllSeverities}
          onfileClicked={this._onfileClicked} />
        {fileDetails}
      </div>
    )
  }

  _renderFileDetails(className) {
    const { groups } = this.props
    const { selectedFile, selectedLocation, includeAllSeverities } = this.state
    if (selectedFile == null || !groups.has(selectedFile)) {
      return (
        <div className={className}>Please selecte a file in the above table</div>
      )
    }
    const {
        ics
      , icLocations
      , deopts
      , deoptLocations
      , codes
      , codeLocations
      , src
      , relativePath
    } = groups.get(selectedFile)
    return (
      <div className={className}>
        <CodeView
          className='flex-column vh-85 w-50 overflow-scroll code-view'
          selectedLocation={selectedLocation}
          code={src}
          ics={ics}
          icLocations={icLocations}
          deopts={deopts}
          deoptLocations={deoptLocations}
          codes={codes}
          codeLocations={codeLocations}
          includeAllSeverities={includeAllSeverities}
          onmarkerClicked={this._onlocationSelected} />
        <SummaryView
          className='flex-column vh-85 w-50 overflow-scroll'
          file={selectedFile}
          relativePath={relativePath}
          selectedLocation={selectedLocation}
          ics={ics}
          icLocations={icLocations}
          deopts={deopts}
          deoptLocations={deoptLocations}
          codes={codes}
          codeLocations={codeLocations}
          includeAllSeverities={includeAllSeverities}
          onsummaryClicked={this._onlocationSelected} />
      </div>
    )
  }

  _onlocationSelected(id) {
    this.setState(Object.assign(this.state, { selectedLocation: id }))
  }

  _onincludeAllSeveritiesChanged(includeAllSeverities) {
    this.setState(Object.assign(this.state, { includeAllSeverities, selectedLocation: null }))
  }

  _onfileClicked(file) {
    this.setState(Object.assign(this.state, { selectedFile: file, selectedLocation: null }))
  }
}

async function deoptigateRender(groupedByFile) {
  try {
    const groupedByFileAndLocation = deoptigate(groupedByFile)

    render(
      <MainView groups={groupedByFileAndLocation} />
    , app()
    )
  } catch (err) {
    console.error(err)
  }
}

module.exports = deoptigateRender
