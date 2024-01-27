import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { TextInput, Button, Alert } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
const DashProfile = () => {
    const filePickerRef = useRef();
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                });
            }
        );
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    return (
        <>
            <div className="max-w-lg mx-auto p-3 w-full">
                <form className="flex flex-col gap-4 my-20">
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
                    />
                    <TextInput
                        type="email"
                        id="email"
                        placeholder="email"
                        defaultValue={currentUser.data.email}
                    />
                    <TextInput
                        type="password"
                        id="password"
                        placeholder="password"
                    />
                    <Button
                        type="submit"
                        gradientDuoTone="purpleToBlue"
                        outline
                    >
                        Update
                    </Button>
                </form>
                <div className="text-red-500 flex justify-between mt-5">
                    <span className="cursor-pointer">Delete Account</span>
                    <span className="cursor-pointer">Sign Out</span>
                </div>
            </div>
        </>
    );
};
export default DashProfile;
