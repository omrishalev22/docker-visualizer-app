import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DockerImageCreatorService } from './docker.image.creator.service';


@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

    // Main task
    task: AngularFireUploadTask;

    // Progress monitoring
    percentage: Observable<number>;

    snapshot: Observable<any>;

    // Download URL
    downloadURL: Observable<string>;

    // State for dropzone CSS toggling
    isHovering: boolean;

    constructor(private storage: AngularFireStorage,
                private db: AngularFirestore,
                private dockerCreationService: DockerImageCreatorService) {
    }


    toggleHover(event: boolean) {
        this.isHovering = event;
    }


    startUpload(event: FileList) {
        // The File object
        const file = event.item(0)

        // Client-side validation example
        console.log(file.type);
        if (!file.type.split('/')[1].includes('yaml')) {
            console.error('unsupported file type should be .yml');
            return;
        }

        // The storage path
        const path = `docker-compose-app/${new Date().getTime()}_${file.name}`;

        // Totally optional metadata
        const customMetadata = {app: 'My AngularFire-powered PWA!'};

        // The main task
        this.task = this.storage.upload(path, file, {customMetadata})

        // Progress monitoring
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(
            tap(snap => {
                console.log(snap);
                if (snap.bytesTransferred === snap.totalBytes) {
                    // Update firestore on completion
                    this.db.collection('photos').add({path, size: snap.totalBytes})
                    this.downloadURL = this.storage.ref(snap.metadata.fullPath).getDownloadURL();
                    // sending image over the server to create PNG out of the file
                    this.dockerCreationService.createDockerImage(this.downloadURL).subscribe(res => {
                        console.log(res);
                        // TODO -> delete the image from firebase storage;
                    })

                }
            })
        )


    }


    // Determines if the upload task is active
    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
    }


}

