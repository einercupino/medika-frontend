import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import PatientRegister from "./pages/PatientRegister"
import PatientDashboard from "./pages/PatientDashboard"
import PatientGame from "./pages/PatientGame"
import PatientChecklist from "./pages/PatientAssessment"
import NurseRegister from "./pages/NurseRegister"
import NurseDashboard from "./pages/NurseDashboard"
import NurseVitalSigns from "./pages/NurseVitalSigns"
import NurseDiagnose from "./pages/NurseDiagnose"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/dashboard/:patientId" element={<PatientDashboard />} />
        <Route path="/patient/game/:patientId" element={<PatientGame />} />
        <Route path="/patient/checklist/:patientId" element={<PatientChecklist />} />
        <Route path="/nurse/register" element={<NurseRegister />} />
        <Route path="/nurse/dashboard/:nurseId" element={<NurseDashboard />} />
        <Route path="/nurse/vital-signs/:patientId" element={<NurseVitalSigns />} />
        <Route path="/nurse/vital-signs/diagnose/:vitalSignId" element={<NurseDiagnose />} />
      </Routes>
    </>
  )
}

export default App
