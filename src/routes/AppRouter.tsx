import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/authPages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import UserMenu from '../pages/userPages/UserMenu';
import RegisterPage from '../pages/authPages/RegisterPage';
import AdminMenu from '../pages/adminPages/AdminMenu';
import CreateProjectPage from '../pages/userPages/CreateProjectPage';
import UserPage from '../pages/userPages/UserPage';
import EditUserPage from '../pages/userPages/EditUserPage';
import MyProjectsPage from '../pages/userPages/MyProjectsPage';
import AdminProjectsPage from '../pages/adminPages/AdminProjectsPage';
import AdminUsersPage from '../pages/adminPages/AdminUsersPage';
import CreateAdminPage from '../pages/adminPages/CreateAdminPage';
import DiagramTypeABM from '../pages/adminPages/DiagramTypeABM';
import EditDiagramType from '../pages/adminPages/EditDiagramType';
import TaskStateABM from '../pages/adminPages/TaskStateABM';
import EditTaskState from '../pages/adminPages/EditTaskState';
import ProjectView from '../pages/userPages/ProjectView';

const AppRouter = ({ setShowSidebar }: { setShowSidebar: (show: boolean) => void }) => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage setShowSidebar={setShowSidebar}/>} />
      <Route path="/register" element={<RegisterPage setShowSidebar={setShowSidebar}/>} />
      <Route element={<ProtectedRoute requiredRole="USER"/>}>
        <Route path="/menu" element={<UserMenu />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/edit" element={<EditUserPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        <Route path="/projects/all" element={<MyProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectView />} />
      </Route>
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin" element={<AdminMenu />} />
        <Route path="/admin/create" element={<CreateAdminPage />} />
        <Route path="/admin/user" element={<UserPage />} />
        <Route path="/admin/user/edit" element={<EditUserPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/diagramtype" element={<DiagramTypeABM />} />
        <Route path="/admin/diagramtype/:id" element={<EditDiagramType />} />
        <Route path="/admin/taskstate" element={<TaskStateABM />} />
        <Route path="/admin/taskstate/:id" element={<EditTaskState />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;




