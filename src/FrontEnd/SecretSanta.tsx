import React, { useState } from 'react'
import axios from 'axios'
import { Button, Upload, Spin, Alert, Modal, message } from 'antd'
import { FaFileUpload } from 'react-icons/fa'
import { UploadOutlined } from '@ant-design/icons'

const SecretSanta = () => {
  const [employeeFile, setEmployeeFile] = useState<File | null>(null)
  const [previousYearFile, setPreviousYearFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'info'
  >('info')
  const [showAlert, setShowAlert] = useState(false)
  const [downloadData, setDownloadData] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const handleFileChange = (file: File, type: 'employee' | 'previousYear') => {
    if (type === 'employee') {
      setEmployeeFile(file)
    } else {
      setPreviousYearFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!employeeFile || !previousYearFile) {
      setAlertMessage('Please upload both files!')
      setAlertSeverity('error')
      setShowAlert(true)
      return
    }

    const formData = new FormData()
    formData.append('employeeFile', employeeFile)
    formData.append('previousYearFile', previousYearFile)

    try {
      setIsLoading(true)
      const response = await axios.post(
        'http://localhost:5000/upload',
        formData,
        {
          responseType: 'text' 
        }
      )

      setDownloadData(response.data)
      setAlertMessage('Secret Santa assignments generated successfully!')
      setAlertSeverity('success')
      setShowAlert(true)

      setModalVisible(true)
    } catch (error) {
      console.error('Error uploading files:', error)
      setAlertMessage(
        'There was an error uploading the files. Please try again.'
      )
      setAlertSeverity('error')
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (downloadData) {
      const blob = new Blob([downloadData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', 'secret_santa_assignments.csv')
      document.body.appendChild(a)
      a.click()
    }
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: '#00796b',
          color: '#fff',
          padding: '15px 20px',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600
        }}
      >
        Acme Secret Santa
      </div>

      <div
        style={{
          backgroundImage:
            'url("https://img.freepik.com/free-photo/view-santa-claus-holding-present_23-2150936525.jpg?t=st=1739344757~exp=1739348357~hmac=f69fe4ced2a9570d820268533e5a946b449484e29827f5b3ac9d58ea68295f32&w=1060")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '87vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h4
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              marginBottom: '20px',
              color: '#333'
            }}
          >
            Secret Santa Event
          </h4>

          {showAlert && (
            <Alert
              message={alertMessage}
              type={alertSeverity}
              style={{
                marginBottom: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}
            />
          )}

          <div style={{ marginBottom: '20px', width: '100%' }}>
            <Upload
              customRequest={() => {}}
              showUploadList={false}
              onChange={({ file }) =>
                handleFileChange(file.originFileObj as File, 'employee')
              }
              accept='.csv'
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  width: '100%',
                  backgroundColor: '#00796b',
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: '20px',
                  textAlign: 'center',
                  transition: 'background-color 0.3s', fontFamily: 'poppins',
                  fontSize: '14px',
                  padding: '34px',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = '#004d40')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = '#00796b')
                }
              >
                {employeeFile
                  ? `File Uploaded: ${employeeFile.name}`
                  : 'Upload Employee CSV'}
              </Button>
            </Upload>
          </div>

          <div style={{ marginBottom: '20px', width: '100%' }}>
            <Upload
              customRequest={() => {}}
              showUploadList={false}
              onChange={({ file }) =>
                handleFileChange(file.originFileObj as File, 'previousYear')
              }
              accept='.csv'
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  borderRadius: '8px',
                  width: '100%',
                  backgroundColor: '#ff4081',
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: '20px',
                  transition: 'background-color 0.3s',     fontFamily: 'poppins',
                  fontSize: '14px',
                  padding: '32px',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = '#c60055')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = '#ff4081')
                }
              >
                {previousYearFile
                  ? `File Uploaded: ${previousYearFile.name}`
                  : 'Upload Previous Year CSV'}
              </Button>
            </Upload>
          </div>

          <Button
            type='primary'
            icon={isLoading ? <Spin /> : <FaFileUpload />}
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              borderRadius: '58px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00796b',
              color: '#fff',
              fontWeight: 500,
              transition: 'background-color 0.3s',
              fontFamily: 'poppins',
              fontSize: '14px',
              padding: '32px',
              width: '50%'
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = '#004d40')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = '#00796b')
            }
          >
            {isLoading ? 'Generating...' : 'Generate Secret Santa Assignments'}
          </Button>
        </div>

        <Modal
          title='Generated Secret Santa Assignments'
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key='download' type='primary' onClick={handleDownload}>
              Download CSV
            </Button>
          ]}
        >
          {downloadData ? (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                backgroundColor: '#f0f0f0',
                padding: '10px',
                borderRadius: '8px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {downloadData}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default SecretSanta
