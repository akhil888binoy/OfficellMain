import { TimelineShell } from "../components/common/TimelineShell";
import CompanyRegister from "../components/company/CompanyRegister";

const RegisterCompanyPage = () => {
    return (
    <TimelineShell title="Add a company" subtitle="Help others find stories about this workplace">
      <CompanyRegister />
    </TimelineShell>
    )
}

export default RegisterCompanyPage
