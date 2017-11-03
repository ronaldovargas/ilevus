import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { injectGlobal, ThemeProvider } from 'styled-components'
import Helmet from 'react-helmet'

import { GoogleTagManager } from 'containers'



import _ from "underscore";
import Messages from "ilevus/jsx/core/util/Messages.jsx";
import moment from "moment";
import moment_pt_br from "moment/locale/pt-br.js";
import moment_es from "moment/locale/es.js";
import Numeral from "numeral";
import Toastr from "toastr";
import S from "string";
import Marked from "marked";
const IndexRedirect = ReactRouter.IndexRedirect;
const IndexRoute = ReactRouter.IndexRoute;
const browserHistory = ReactRouter.browserHistory;
const hashHistory = ReactRouter.hashHistory;

import Application from "ilevus/jsx/Application.jsx";
import Error from "ilevus/jsx/core/view/Error.jsx";
import Home from "ilevus/jsx/core/view/Home.jsx";
import NotFound from "ilevus/jsx/core/view/NotFound.jsx";
import Search from "ilevus/jsx/core/view/Search.jsx";
import TermosPrivacidade from "ilevus/jsx/core/view/TermosPrivacidade.jsx";
import Login from "ilevus/jsx/core/view/user/Login.jsx";
import ConfirmEmail from "ilevus/jsx/core/view/user/ConfirmEmail.jsx";
import ConfirmEmailChange from "ilevus/jsx/core/view/user/ConfirmEmailChange.jsx";
import PublicProfile from "ilevus/jsx/core/view/user/PublicProfile.jsx";
import RecoverPassword from "ilevus/jsx/core/view/user/RecoverPassword.jsx";
import Register from "ilevus/jsx/core/view/user/Register.jsx";
import ResetPassword from "ilevus/jsx/core/view/user/ResetPassword.jsx";
import ProfileWizard from "ilevus/jsx/core/view/user/wizard/ProfileWizard.jsx";
import ProfileWizardBasic from "ilevus/jsx/core/view/user/wizard/ProfileWizardBasic.jsx";
import ProfileWizardAddress from "ilevus/jsx/core/view/user/wizard/ProfileWizardAddress.jsx";
import ProfileWizardEducation from "ilevus/jsx/core/view/user/wizard/ProfileWizardEducation.jsx";
import ProfileWizardCareer from "ilevus/jsx/core/view/user/wizard/ProfileWizardCareer.jsx";
import ProfileWizardServices from "ilevus/jsx/core/view/user/wizard/ProfileWizardServices.jsx";
import ProfileWizardBankAccount from "ilevus/jsx/core/view/user/wizard/ProfileWizardBankAccount.jsx";
import UserAccount from "ilevus/jsx/core/view/user/Account.jsx";
import UserDashboard from "ilevus/jsx/core/view/user/Dashboard.jsx";
import UserFinancial from "ilevus/jsx/core/view/user/Financial.jsx";
import UserManagement from "ilevus/jsx/core/view/user/Management.jsx";
import UserProfessionalProfile from "ilevus/jsx/core/view/user/ProfessionalProfile.jsx";
import UserProfile from "ilevus/jsx/core/view/user/Profile.jsx";
import UserSchedule from "ilevus/jsx/core/view/user/Schedule.jsx";
import UserViewSchedule from "ilevus/jsx/core/view/user/ViewSchedule.jsx";
import UserAssessments from "ilevus/jsx/core/view/user/Assessments.jsx";
import ProcessDefinition from "ilevus/jsx/core/view/user/coaching/CoachingProcessesDefinition.jsx";
import CoachingToolsContainer from "ilevus/jsx/core/view/user/coaching/tools/CoachingToolsContainer.jsx";
import CoachingProcesses from "ilevus/jsx/core/view/user/coaching/CoachingProcesses.jsx";
import HireProfessional from "ilevus/jsx/core/view/user/coaching/HireProfessional.jsx";
import SessionDetails from "ilevus/jsx/core/view/user/coaching/SessionDetails.jsx";
import WheelOfLifeConfigure from "ilevus/jsx/core/view/user/coaching/tools/wheeloflife/Configure.jsx";
import WheelOfLife from "ilevus/jsx/core/view/user/coaching/tools/wheeloflife/WheelOfLife.jsx";
import AdminPanel from "ilevus/jsx/core/view/admin/AdminPanel.jsx";
import AdminPanelHome from "ilevus/jsx/core/view/admin/AdminPanelHome.jsx";
import AdminPanelAds from "ilevus/jsx/core/view/admin/AdminPanelAds.jsx";
import AdminPanelApis from "ilevus/jsx/core/view/admin/AdminPanelApis.jsx";
import AdminPanelDefinitions from "ilevus/jsx/core/view/admin/AdminPanelDefinitions.jsx";
import AdminPanelModerationAds from "ilevus/jsx/core/view/admin/AdminPanelModerationAds.jsx";
import AdminPanelUsers from "ilevus/jsx/core/view/admin/AdminPanelUsers.jsx";
import AdminPanelEmails from "ilevus/jsx/core/view/admin/AdminPanelEmails.jsx";
import AdminPanelSubscriptions from "ilevus/jsx/core/view/admin/AdminPanelSubscriptions.jsx";
import AdminPanelSubscriptionsCustomer from "ilevus/jsx/core/view/admin/AdminPanelSubscriptionsCustomer.jsx";
import AdminPanelSubscriptionsDetails from "ilevus/jsx/core/view/admin/AdminPanelSubscriptionsDetails.jsx";
import AdminPanelSubscriptionsInvoice from "ilevus/jsx/core/view/admin/AdminPanelSubscriptionsInvoice.jsx";
import AdminPanelTranslate from "ilevus/jsx/core/view/admin/AdminPanelTranslate.jsx";
import AdminPanelMensagens from "ilevus/jsx/core/view/admin/AdminPanelMensagens.jsx";
import AdminPanelSitemap from "ilevus/jsx/core/view/admin/AdminPanelSitemap.jsx";
import AdminPanelReports from "ilevus/jsx/core/view/admin/AdminPanelReports.jsx";
import Notifications from "ilevus/jsx/core/view/notifications/Notifications.jsx";
import NotificationsMessages from "ilevus/jsx/core/view/notifications/NotificationsMessages.jsx";
import NotificationsTimeline from "ilevus/jsx/core/view/notifications/NotificationsTimeline.jsx";
import NotificationsDetalhes from "ilevus/jsx/core/view/notifications/DetalheNotificacao.jsx";
import Subscribe from "ilevus/jsx/core/view/user/Subscribe.jsx";
import Checkout from "ilevus/jsx/core/view/user/Checkout.jsx";
import MarkdownGuide from "ilevus/jsx/core/view/help/MarkdownGuide.jsx";


// https://github.com/diegohaz/arc/wiki/Styling
import theme from './themes/default'

injectGlobal`
  body {
    margin: 0;
  }
`

// string config
S.TMPL_OPEN = '{';
S.TMPL_CLOSE = '}';

// Numeral configuration
Numeral.locale('pt-BR', require("numeral/locales/pt-br.js"));
Numeral.locale('es', require("numeral/locales/es.js"));
Numeral.locale("pt-BR");

//Toastr.options.positionClass = "toast-top-center";
Toastr.options.positionClass = "toast-top-full-width";
Toastr.options.timeOut = 4000;
Toastr.options.extendedTimeOut = 10000;

// Marked configuration
Marked.setOptions({
  renderer: new Marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


const App = () => {
  return (
    <div>
      <Helmet titleTemplate="ARc - %s">
        <title>Atomic React</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="React starter kit based on Atomic Design with React Router v4, Webpack, Redux, Server Side Rendering and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:site_name" content="ARc" />
        <meta property="og:image" content="https://arc.js.org/thumbnail.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="https://arc.js.org/icon.png" />
      </Helmet>
      <GoogleTagManager />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/" component={Application}>
            <IndexRedirect to="home" />

            <Route path="home" component={Home} />
            <Route path="login" component={Login} />
            <Route path="auth-callback/:accessToken" component={Login} />
            <Route path="confirm-email/:email/:token" component={ConfirmEmail} />
            <Route path="confirm-email-change/:email/:token" component={ConfirmEmailChange} />
            <Route path="recover-password" component={RecoverPassword} />
            <Route path="reset-password/:email/:token" component={ResetPassword} />
            <Route path="signup" component={Register} />
            <Route path="termos-privacidade" component={TermosPrivacidade} />

            <Route path="help">
              <IndexRoute component={MarkdownGuide} />
            </Route>

            <Route path="profile/:id" component={PublicProfile} />
            <Route path="search/:term" component={Search} />
            <Route path="assessments" component={UserAssessments} />

            <Route path="user" component={UserManagement}>
              <Route path="account" component={UserAccount} />
              <Route path="dashboard" component={CoachingProcesses} />
              <Route path="financial" component={UserFinancial} />
              <Route path="processes" component={ProcessDefinition} />
              <Route path="professional-profile" component={UserProfessionalProfile} />
              <Route path="profile" component={UserProfile} />
              <Route path="schedule" component={UserViewSchedule} />
              <Route path="assessments" component={UserAssessments} />
              <Route path="schedule/configure" component={UserSchedule} />
              <Route path="coaching-tools" component={CoachingToolsContainer}>
                <Route path="wheeloflife" component={WheelOfLifeConfigure} />
              </Route>
            </Route>
            <Route path="subscribe" component={Subscribe} />
            <Route path="checkout" component={Checkout} />

            <Route path="coaching/process/:id">
              <IndexRoute component={SessionDetails} />
              <Route path=":session" component={SessionDetails}>
                <Route path="tools/wheeloflife" component={WheelOfLife} />
              </Route>
            </Route>
            <Route path="coaching/hire/:id" component={HireProfessional} />

            <Route path="admin" component={AdminPanel}>
              <Route path="home" component={AdminPanelHome} />
              <Route path="ads" component={AdminPanelAds} />
              <Route path="apis" component={AdminPanelApis} />
              <Route path="definitions" component={AdminPanelDefinitions} />
              <Route path="moderationads" component={AdminPanelModerationAds} />
              <Route path="emails" component={AdminPanelEmails} />
              <Route path="subscriptions" component={AdminPanelSubscriptions}>
                AdminPanelSubscriptionsDetails
                            <Route path="customer/:id" component={AdminPanelSubscriptionsCustomer} />
                <Route path="detail/:id" component={AdminPanelSubscriptionsDetails} />
                <Route path="invoice/:id" component={AdminPanelSubscriptionsInvoice} />
              </Route>
              <Route path="users" component={AdminPanelUsers} />
              <Route path="translate" component={AdminPanelTranslate} />
              <Route path="mensagens" component={AdminPanelMensagens} />
              <Route path="sitemap" component={AdminPanelSitemap} />
              <Route path="reports" component={AdminPanelReports} />
            </Route>

            <Route path="notifications" component={Notifications}>
              <Route path="messages" component={NotificationsMessages} />
              <Route path="messages/:destination" component={NotificationsMessages} />
              <Route path="timeline" component={NotificationsTimeline} />
              <Route path="timeline_detalhe/:destination" component={NotificationsDetalhes} />
            </Route>

            <Route path="become-a-professional" component={ProfileWizard}>
              <Route path="basic" component={ProfileWizardBasic} />
              <Route path="address" component={ProfileWizardAddress} />
              <Route path="education" component={ProfileWizardEducation} />
              <Route path="career" component={ProfileWizardCareer} />
              <Route path="services" component={ProfileWizardServices} />
              <Route path="bankAccount" component={ProfileWizardBankAccount} />
            </Route>

            <Route path="*" component={NotFound} />
          </Route>
        </Switch>
      </ThemeProvider>
    </div>
  )
}

export default App
