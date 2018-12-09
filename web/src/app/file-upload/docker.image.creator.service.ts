import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class DockerImageCreatorService {

    constructor(private http: HttpClient) {

    }

    createDockerImage(url) {
        let body = new HttpParams();
        console.log(url);
        body = body.set('url', url);
        return this.http.post('/api/build', body);
}

}