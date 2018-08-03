import React from 'react'
import QRReader from 'react-qr-reader'

const QRReaderContainer = ({...props}) => {

  return (
    <div>
      <QRReader
        delay={props.delay}
        onError={props.onError}
        onScan={props.onScan}
      />
    </div>
  )
}

export default QRReaderContainer;