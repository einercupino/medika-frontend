import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import PatientRegister from "./pages/PatientRegister"
import PatientDashboard from "./pages/PatientDashboard"
import PatientChecklist from "./pages/PatientAssessment"
import NurseRegister from "./pages/NurseRegister"
import NurseDashboard from "./pages/NurseDashboard"
import NurseVitalSigns from "./pages/NurseVitalSigns"
import NurseRoute from "./auths/NurseRoute"
import PatientRoute from "./auths/PatientRoute"
import { AuthProvider } from "./auths/AuthContext"

function App() {

  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/nurse/register" element={<NurseRegister />} />

        <Route
        path="/patient/dashboard/:patientId"
        element={
          <PatientRoute>
            <PatientDashboard />
          </PatientRoute>
        }
      />
      <Route
        path="/patient/checklist/:patientId"
        element={
          <PatientRoute>
            <PatientChecklist />
          </PatientRoute>
        }
      />

        <Route
        path="/nurse/dashboard/:nurseId"
        element={
          <NurseRoute>
            <NurseDashboard />
          </NurseRoute>
        }
      />
      <Route
        path="/nurse/vital-signs/:patientId"
        element={
          <NurseRoute>
            <NurseVitalSigns />
          </NurseRoute>
        }
      />
      </Routes>
      </AuthProvider>
    </>
  )
}

export default App
