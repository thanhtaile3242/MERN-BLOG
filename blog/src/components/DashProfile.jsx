import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashProfile = () => {
    const dispatch = useDispatch();
    const filePickerRef = useRef();
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    "Can not upload image (File must be less than 2MB)"
                );
                setImageFileUploadProgress(null);
                setImageFileUrl(null);
                setImageFile(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };
    const handleSumbit = async (event) => {
        event.preventDefault();
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes made");
            return;
        }
        if (imageFileUploading) {
            return;
        }
        try {
            dispatch(updateStart());
            const response = await fetch(
                `/api/user/update/${currentUser.data._id}`,
                {
                    method: `PUT`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();
            if (!data.success) {
                dispatch(updateFailure(data.message));
                setUpdateUserSuccess(null);
                setUpdateUserError(data.meesage);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserError(null);
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserSuccess(null);
            setUpdateUserError(error.meesage);
        }
    };
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const response = await fetch(
                `/api/user/delete/${currentUser.data._id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();
            console.log(response);
            if (!response.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                console.log("a");
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };
    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <>
            <div className="max-w-lg mx-auto p-3 w-full">
                <form
                    onSubmit={handleSumbit}
                    className="flex flex-col gap-4 my-20"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={filePickerRef}
                        hidden
                    />
                    <div
                        className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                        onClick={() => {
                            filePickerRef.current.click();
                        }}
                    >
                        {imageFileUploadProgress && (
                            <CircularProgressbar
                                value={imageFileUploadProgress || 0}
                                text={`${imageFileUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    root: {
                                        width: "100%",
                                        heigh: "100%",
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                    },
                                    path: {
                                        stroke: `rgba(62,152,199,${
                                            imageFileUploadProgress / 100
                                        })`,
                                    },
                                }}
                            />
                        )}
                        <img
                            src={
                                imageFileUrl || currentUser.data.profilePicture
                            }
                            alt="user"
                            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                                imageFileUploadProgress &&
                                imageFileUploadProgress < 100 &&
                                "opacity-60"
                            }`}
                        />
                    </div>
                    {imageFileUploadError && (
                        <Alert color="failure">{imageFileUploadError}</Alert>
                    )}
                    <TextInput
                        type="text"
                        id="username"
                        placeholder="username"
                        defaultValue={currentUser.data.username}
                        onChange={handleChange}
                    />
                    <TextInput
                        type="email"
                        id="email"
                        placeholder="email"
                        defaultValue={currentUser.data.email}
                        onChange={handleChange}
                    />
                    <TextInput
                        type="password"
                        id="password"
                        placeholder="password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        gradientDuoTone="purpleToBlue"
                        outline
                        disable={loading || imageFileUploading}
                    >
                        {loading ? "Loading ..." : "Update"}
                    </Button>
                    {currentUser.data.isAdmin && (
                        <Link to="/create-post">
                            <Button
                                type="button"
                                gradientDuoTone="purpleToPink"
                                className="w-full"
                            >
                                Create a post
                            </Button>
                        </Link>
                    )}
                </form>
                <div className="text-red-500 flex justify-between mt-5">
                    <span
                        onClick={() => {
                            setShowModal(true);
                        }}
                        className="cursor-pointer"
                    >
                        Delete Account
                    </span>
                    <span className="cursor-pointer" onClick={handleSignout}>
                        Sign Out
                    </span>
                </div>
                {updateUserSuccess && (
                    <Alert color="success" className="mt-5">
                        {updateUserSuccess}
                    </Alert>
                )}
                {updateUserError && (
                    <Alert color="failure" className="mt-5">
                        {updateUserError}
                    </Alert>
                )}
                {error && (
                    <Alert color="failure" className="mt-5">
                        {error}
                    </Alert>
                )}

                <Modal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    popup
                    size="md"
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Are you sure to delete your account?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={handleDeleteUser}
                                >
                                    Yes
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => {
                                        setShowModal(false);
                                    }}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};
export default DashProfile;
