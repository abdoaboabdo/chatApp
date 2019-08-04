require('./bootstrap');

//window.Vue = require('vue');
import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
    // host:  'http://192.168.1.102:6001'
});

let onlineUser=0;

window.Echo.join(`online`)
    .here((users) => {
        console.log(users);
        onlineUser=users.length;
        if (users.length > 1){
            $('#no-online-user').css('display','none');
        }
        let userId=$('meta[name=user-id]').attr('content');

        users.forEach(function (user) {
            if (user.id == userId){
                return;
            }
            $('#online-user').append(`<li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span>  ${user.name}</li>`);
        });
    })
    .joining((user) => {
        console.log(user.name);
        onlineUser++;
        $('#no-online-user').css('display','none');
        $('#online-user').append(`<li id="user-${user.id}" class="list-group-item"><span class="icon icon-circle text-success"></span>  ${user.name}</li>`);
    })
    .leaving((user) => {
        console.log(user.name);
        onlineUser--;
        if(onlineUser == 1){
            $('#no-online-user').css('display','block');
        }
        $('#user-'+user.id).remove();
    });



$('#chat-text').keypress(function(e){
    if (e.which == 13){
        e.preventDefault();
        let body=$(this).val();
        let url=$(this).data('url');
        let name=$('meta[name=user-name]').attr('content');
        $(this).val('');
        let data={
            '_token':$('meta[name=csrf-token]').attr('content'),
            body
        };
        $.ajax({
            url:url,
            method:'post',
            data:data,
            success:function(){

            }
        });
        $('#chat').append(`
            <div class="mt-4 w-50 text-white p-3 rounded float-right bg-primary">
                <p>${name}</p>
                <p>${body}</p>
            </div>
            <div class="clearfix"></div>
        `);
    }
});





window.Echo.channel('laravel_database_chat_group')
    .listen('MessageDelivered', (e) => {
        console.log(e.message.user.name);
        $('#chat').append(`
            <div class="mt-4 w-50 text-white p-3 rounded float-left bg-warning">
                <p>${e.message.user.name}</p>
                <p>${e.message.body}</p>
            </div>
            <div class="clearfix"></div>
        `);
    });



// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

//Vue.component('example-component', require('./components/ExampleComponent.vue').default);


// const app = new Vue({
//     el: '#app'
// });
