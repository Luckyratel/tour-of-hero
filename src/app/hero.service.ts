import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';


import {catchError,map,tap} from 'rxjs/operators';
import {Hero} from './hero';



import {MessageService} from './message.service';



const  httpOptions = {
  headers: new HttpHeaders({'Content-Type' : 'application/json'})
};

@Injectable({ providedIn: 'root'})


export class HeroService {

  private heroesUrl = "/api/heroes";

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ){ }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(

      tap(_=>this.log("fetched Heroes")),
      catchError(this.handleError('getHeroes',[]))
    );

  }

  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;

    return this.http.get<Hero[]>(url).pipe(
      map(heroes => heroes[0]),
      tap(h =>{
        const outcome = h?'fetched':'did not found';
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }


  getHero(id: number): Observable<Hero> {

    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),

      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }


  updataHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updata hero id=${hero.id}`)),
      catchError(this.handleError<any>("updataHero"))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),

      catchError(this.handleError<Hero>('addHero'))
    );
  }


  deleteHero(hero: Hero | number): Observable<Hero> {

    const id = typeof hero === 'number'? hero : hero.id;

    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>("deleteHero"))
    );

  }



  searchHeroes(item: string): Observable<Hero[]> {
    if(!item.trim())
    {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${item}`).pipe(
      tap(_ => this.log(`found heroes matching "${item}"`)),
      catchError(this.handleError<Hero[]>("searchHeroes",[]))
    )

  }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }


  private handleError<T> (operation = 'operation', result?: T)
  {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

}

