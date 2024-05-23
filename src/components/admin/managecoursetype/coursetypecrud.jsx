import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Table, Button, Pagination, Form, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const fetchCourseTypes = async ({ queryKey }) => {
    const [_key, { page, pageSize, name }] = queryKey;
    const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/getalls?pageNumber=${page}&pageSize=${pageSize}&name=${name}`);
    return response.data;
};

const fetchCourseTypesWithFilter = async ({ queryKey }) => {
    const [_key, { firstFilter, secondFilter, page, pageSize }] = queryKey;
    const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/getalls-second-filter?firstFilter=${firstFilter}&secondFilter=${secondFilter}&pageNumber=${page}&pageSize=${pageSize}`);
    return response.data;
};

function CourseTypeCRUD() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [name, setName] = useState('');
    const [firstFilter, setFirstFilter] = useState('');
    const [secondFilter, setSecondFilter] = useState('');
    const [firstInputValue, setFirstInputValue] = useState(''); // new state variable for the first input value
    const [secondInputValue, setSecondInputValue] = useState(''); // new state variable for the second input value
    const [courseTypeToUpdate, setCourseTypeToUpdate] = useState(null);
    const [newCourseTypeName, setNewCourseTypeName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [courseTypeToView, setCourseTypeToView] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseTypeToDelete, setCourseTypeToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorKey, setErrorKey] = useState(0);

    const { data: courseTypes, isLoading: isLoadingCourseTypes } = useQuery(['courseTypes', { page, pageSize, name }], fetchCourseTypes, {
        enabled: !firstFilter, // only call fetchCourseTypes when firstFilter is not set
    });

    const { data: filteredCourseTypes, isLoading: isLoadingFilteredCourseTypes } = useQuery(['filteredCourseTypes', { firstFilter, secondFilter, page, pageSize }], fetchCourseTypesWithFilter, {
        enabled: !!firstFilter, // only call fetchCourseTypesWithFilter when firstFilter is set
    });

    useEffect(() => {
        if (firstFilter) {
            queryClient.invalidateQueries(['filteredCourseTypes', { firstFilter, secondFilter, page, pageSize }]);
        }
    }, [firstFilter]);

    const isLoading = isLoadingCourseTypes || isLoadingFilteredCourseTypes;
    if (isLoading) return 'Loading...';

    const displayedData = firstFilter ? filteredCourseTypes : courseTypes; // use filtered data when firstFilter is set, otherwise use all data

    const handleSearch = () => {
        setFirstFilter(firstInputValue); // update firstFilter when the search is performed
        setSecondFilter(secondInputValue); // update secondFilter when the search is performed
    };

    const createCourseType = async () => {

        try {
            const token = localStorage.getItem('accessToken'); // Replace 'your_token' with your actual token
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/create-course-type`, { name: newCourseTypeName }, config);
            if (response.data.isSuccess) {
                alert('Tạo loại khóa học thành công');
                setShowCreateModal(false);
                setNewCourseTypeName(''); // reset the name
                queryClient.invalidateQueries(['courseTypes', { page, pageSize, name }]);
                queryClient.invalidateQueries(['filteredCourseTypes', { firstFilter, secondFilter, page, pageSize }]);
            } else {
                alert('Có lỗi xảy ra khi tạo loại khóa học');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi tạo loại khóa học');
        }
    };


    const getCourseType = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/get-course-type/${id}`);
            if (response.data.isSuccess) {
                setCourseTypeToView(response.data.data);
                setShowDetailModal(true);
            } else {
                alert('Có lỗi xảy ra khi lấy thông tin loại khóa học');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi lấy thông tin loại khóa học');
        }
    };


    const updateCourseType = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Replace 'your_token' with your actual token
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log(courseTypeToUpdate);

            const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/update-course-type/${courseTypeToUpdate.id}`, courseTypeToUpdate, config);
            if (response.data.isSuccess) {
                alert('Cập nhật loại khóa học thành công');
                setShowUpdateModal(false);
                queryClient.invalidateQueries(['courseTypes', { page, pageSize, name }]);
                queryClient.invalidateQueries(['filteredCourseTypes', { firstFilter, secondFilter, page, pageSize }]);
            } else {
                setErrorMessage(error.response.data.errors[0]);
                setShowError(true);
                setTimeout(() => setShowError(false), 5000); // hide the error message after 5 seconds
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrorMessage(error.response.data.errors[0]);
                setShowError(true);
                setErrorKey(oldKey => oldKey + 1);
                setTimeout(() => setShowError(false), 5000); // hide the error message after 5 seconds
            } else {
                setErrorMessage('An error occurred while deleting the course type.');
                setShowError(true);
                setErrorKey(oldKey => oldKey + 1);
                setTimeout(() => setShowError(false), 5000); // hide the error message after 5 seconds
            }
        }
    };


    const deleteCourseType = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Thay thế 'your_token' bằng token thực tế của bạn
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log(courseTypeToDelete.id);

            const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/coursetype/delete-course-type/${courseTypeToDelete.id}`, config);
            console.log(response);
            if (response.data.isSuccess) {
                alert('Xóa loại khóa học thành công');
                setShowDeleteModal(false);
                queryClient.invalidateQueries(['courseTypes', { page, pageSize, name }]);
                queryClient.invalidateQueries(['filteredCourseTypes', { firstFilter, secondFilter, page, pageSize }]);
            } else {
                alert('Có lỗi xảy ra khi xóa loại khóa học');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrorMessage(error.response.data.errors[0]);
                setShowError(true);
                setErrorKey(oldKey => oldKey + 1);
                setTimeout(() => setShowError(false), 5000); // hide the error message after 5 seconds
            } else {
                setErrorMessage('An error occurred while deleting the course type.');
                setShowError(true);
                setErrorKey(oldKey => oldKey + 1);
                setTimeout(() => setShowError(false), 5000); // hide the error message after 5 seconds
            }
        }
    };



    return (
        <div>
            <h1 className='mb-5'>Manage Course Types</h1>
            <Form onSubmit={e => { e.preventDefault(); handleSearch(); }}>
                <Form.Group controlId="firstFilter">
                    <Form.Label>First Filter</Form.Label>
                    <Form.Control type="text" placeholder="Enter first filter" value={firstInputValue} onChange={e => setFirstInputValue(e.target.value)} />
                </Form.Group>
                {firstFilter && (
                    <Form.Group controlId="secondFilter">
                        <Form.Label>Second Filter</Form.Label>
                        <Form.Control type="text" placeholder="Enter second filter" value={secondInputValue} onChange={e => setSecondInputValue(e.target.value)} />
                    </Form.Group>
                )}
                <Button className='mt-3' type="submit">Search</Button>
            </Form>

            <Button className='mt-5 mb-2' variant="primary" onClick={() => setShowCreateModal(true)}>Create New Course Type</Button>
            <Table striped bordered hover className='mt-5'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedData.data.items.map((courseType, index) => (
                        <tr key={courseType.id}>
                            <td>{(page - 1) * pageSize + index + 1}</td>
                            <td className='text-start'>{courseType.name}</td>
                            <td>
                                <Button variant="outline-primary" size='sm' onClick={() => getCourseType(courseType.id)}>Detail</Button>{' '}
                                <Button
                                    variant="outline-warning"
                                    size='sm'
                                    onClick={() => {
                                        setCourseTypeToUpdate(courseType);
                                        setShowUpdateModal(true);
                                    }}>Update
                                </Button>{' '}
                                <Button
                                    variant="outline-danger"
                                    size='sm' onClick={() => {
                                        setCourseTypeToDelete(courseType);
                                        setShowDeleteModal(true);
                                    }}>Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={page === 1}>FirstPage</Pagination.First>
                <Pagination.Prev onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1} />
                {[...Array(Math.min(5, courseTypes.data.totalPages - page + 1))].map((_, i) => {
                    const pageNumber = page + i;
                    return (
                        <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                        </Pagination.Item>
                    );
                })}
                <Pagination.Next onClick={() => setPage(old => Math.min(old + 1, courseTypes.data.totalPages))} disabled={page === courseTypes.data.totalPages} />
                <Pagination.Last onClick={() => setPage(courseTypes.data.totalPages)} disabled={page === courseTypes.data.totalPages}>LastPage</Pagination.Last>
                <Pagination.Item disabled className='font-monospace'><span className='text-muted fw-lighter'>Total items : ({courseTypes.data.totalItems} items)</span></Pagination.Item>
            </Pagination>




            {/* render create course type */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo loại khóa học mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="createName">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên mới" value={newCourseTypeName} onChange={e => setNewCourseTypeName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={createCourseType}>Tạo mới</Button>
                </Modal.Footer>
            </Modal>


            {/* render detail course type */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết loại khóa học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {courseTypeToView && (
                        <>
                            <p><strong>ID:</strong> {courseTypeToView.id}</p>
                            <p><strong>Name:</strong> {courseTypeToView.name}</p>
                            <p><strong>Create Date:</strong> {new Date(courseTypeToView.createDate).toLocaleDateString()}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* render update course type */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Course Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="updateName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter new name" value={courseTypeToUpdate?.name} onChange={e => setCourseTypeToUpdate(old => ({ ...old, name: e.target.value }))} />
                    </Form.Group>
                </Modal.Body>
                {showError && <Alert variant="danger" key={errorKey}>{errorMessage}</Alert>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={updateCourseType}>Update</Button>
                </Modal.Footer>
            </Modal>


            {/* render delete course type */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa loại khóa học này không?</Modal.Body>
                {showError && <Alert variant="danger" key={errorKey}>{errorMessage}</Alert>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={deleteCourseType}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CourseTypeCRUD;
