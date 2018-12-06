import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DockerImageCreatorService {

    constructor(private http:HttpClient) {

    }

    createDockerImage(url){
        return this.http.post('/api/build',{url:url});
    }

}