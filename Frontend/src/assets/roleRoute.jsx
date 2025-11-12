import React from 'react'

const arrayRoute = {"HOD":"/HOD_Dashboard","Teacher":"/SubjectFacultyDashboard","ClassCoordinator":"/SubjectFacultyDashboard"};
export const roleRoute = (role) => (arrayRoute[role] || "/login");