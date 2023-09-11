<?php
namespace App\Libraries;


use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\Exceptions\BobbyException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\User;

class Portail
{

    protected $token;
    protected $user;
    protected $assos;
    protected $permissions;


    function __construct()
    {
        $this->token = null;
        $this->user = [];
        $this->assos = [];
        $this->permissions = [];
    }
    


    /////////////////////////////
    //
    //       CONSTRUCTOR
    //
    /////////////////////////////


    /**
    *   Public function to authenticate the user (token, associationss, permissions)
    *
    */
    public function authenticateUser($payload)
    {
        // Retrieve user_id from payload and get user from database
        $user_id = $payload->get('user_id');
        $user = User::find($user_id);
        if ($user) {
        
            $this->user = $user;

            // Retrieve token, permissions ans assos from payload
            $this->token = 'Bearer '.$user->token;
            $this->permissions = $payload->get('permissions');
            $this->assos = $payload->get('assos');
        } else {
            throw new HttpException(401, "User not found");
        }
    }




    /////////////////////////////
    //
    //         SETTER
    //
    /////////////////////////////


    /**
    *   Set token
    *
    */
    public function setToken($token)
    {
        $this->token = $token;
    }



    /////////////////////////////
    //
    //         GETTER
    //
    /////////////////////////////




    /**
    *   Get user information
    *
    */
    public function getUserInformation()
    {
        // User 
        $user = $this->getPortalUser();
        $this->user = $user;

        // Assos
        $userassos = [];
        $assos = $this->getPortalUserAssociations();
        foreach ($assos as $asso) {
            array_push($userassos, $asso['id']);
        }
        $user['assos'] = $userassos;
        // $this->assos = $assos;

        // Permissions
        $permissions = $this->getPortalUserPermissions($assos);
        $user['permissions'] = $permissions;

        return $user;
    }

    public function getUser()
    {
        return $this->user;
    }

    /**
     * 
     */

    public function getUserAssociations()
    {
        // return $this->assos;
        $userassos = [];
        foreach ($this->assos as $asso_id) {
            array_push($userassos, $this->showAsso($asso_id));
        }
        return $userassos;
    }


    public function getPermissions()
    {
        return $this->permissions;
    }



    /////////////////////////////
    //
    //       AUTHORIZATION
    //
    /////////////////////////////


    /**
    *   Check the content of "user" which is based on the token
    *
    */
    public function isAuthenticated()
    {

        if (!empty($this->user)) {
            return true;
        }

        throw new HttpException(403, "Unauthorized access");
    }


    /**
    *   Check if the user is a member of the association
    *
    */
    public function isAssociationMember($asso_id){

        $user_assos = $this->assos;

        $asso = array_search($asso_id, $user_assos);

        // $asso = array_filter(
        //         $user_assos,
        //         function ($a) use (&$asso_id) {
        //             return $a['id'] == $asso_id;
        //     }
        // );

        if ($asso !== false) {
            return true;
        }

        throw new HttpException(403, "Unauthorized access");

    }


    /**
    *   Check if the user has Admin Permision for an association
    *
    */
    public function hasAssociationAdminPermission($asso_id){

        $user_assos = $this->assos;
        $user_permissions = $this->permissions;

        $index = array_search($asso_id, $user_assos);

        // $assos = array_filter(
        //         $user_assos,
        //         function ($a) use (&$asso_id) {
        //             return $a['id'] == $asso_id;
        //     }
        // );
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }

        throw new HttpException(403, "Unauthorized access");

    }


    /**
    *   Check if user is member of one of the associations
    *
    */
    public function hasInAssociationsAdminPermission($asso_id1, $asso_id2){

        $user_assos = $this->assos;
        $user_permissions = $this->permissions;

        $index = array_search($asso_id1, $user_assos);
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }

        $index = array_search($asso_id2, $user_assos);
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }

        throw new HttpException(403, "Unauthorized access");
    
    }


    /**
    *   Check if user is member of one of the associations or if user is admin
    *
    */
    public function hasInAssociationsAdminPermissionOrAdmin($asso_id1, $asso_id2)
    {
        $user_assos = $this->assos;
        $user_permissions = $this->permissions;

        if (array_search('admin', $user_permissions) !== false) {
            return true;
        }

        $index = array_search($asso_id1, $user_assos);
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }

        $index = array_search($asso_id2, $user_assos);
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }

        throw new HttpException(403, "Unauthorized access");
    }


    /**
     * Boolean method to know if user is admin of an association
    */
    public function isUserAdminAsso($asso_id){

        $user_assos = $this->assos;
        $user_permissions = $this->permissions;

        $index = array_search($asso_id, $user_assos);
        if ($index !== false) {
            $asso = $this->showAsso($user_assos[$index]);
            if (array_search($asso['login'].'-admin',$user_permissions) !== false){
                return true;
            }
        }
        return false;
    }


    /**
    *   Check admin right
    *
    */
    public function isAdmin(){

        if (array_search("admin", $this->permissions) !== false){
            return true;
        }

        throw new HttpException(403, "Unauthorized access");

    }



    /////////////////////////////
    //
    //     PORTAL FUNCTIONS
    //
    /////////////////////////////


    public function getPortalUser()
    {
        return $this->request('user');
    }


    /**
    *   Get all existing associations
    *
    */
    public function indexAsso()
    {
        $assos_cached = \Cache::get('assos');
        if ($assos_cached) {
            return $assos_cached;
        }
        $assos = $this->request('assos');
        \Cache::add('assos', $assos, 15552000);
        return $assos;
    }


    /**
    *   Get information from one association based on uid
    *
    */
    public function showAsso($uid)
    {
        $asso_cached = \Cache::get('asso_'.$uid);
        if ($asso_cached) {
            return $asso_cached;
        }
        $asso = $this->request('assos/'.$uid);
        \Cache::add('asso_'.$asso["id"], $asso, 259200);
        return $asso;
    }


    /**
     *  Check that an association exists
     */
    public function assoExists($uid)
    {
        $asso = $this->showAsso($uid);
        if ($asso) {
            return;
        }

        throw HttpException(409, "Association introuvale");
    }


    /**
    *   Get permissions from the user
    *
    */
    protected function getPortalUserPermissions($assos)
    {
        $permissions = [];

        $permission_admin = $this->getPortalAdminPermissions();

        if ($permission_admin) {
            array_push($permissions, 'admin');
        }

        foreach ($assos as $asso) {
            $permission_asso = $this->getPortalAssoPermissions($asso['id']);
            if (array_search("bobby", array_column($permission_asso, 'type')) !== false){
                array_push($permissions, $asso['login'].'-admin');
            }
            array_push($permissions, $asso['login']);
        }
        return $permissions;
    }


    /**
    *   Get information from a user based on the token
    *
    */
    protected function getPortalUserInformation()
    {
        return $this->request('user');
    }


    /**
    *   Get user association(s)
    *
    */
    protected function getPortalUserAssociations()
    {
        return $this->request('user/assos?only=joined');
    }


    /**
    *   Get user permissions in an association
    *
    */
    public function getPortalAssoPermissions($asso_id)
    {
        return $this->request('assos/'.$asso_id.'/members/'.$this->user['id'].'/permissions');
    }


    /**
    *   Get User Admin Permission
    *
    */
    protected function getPortalAdminPermissions()
    {
        // return $this->request($request, 'assos/'.$asso_id.'/members/'.$user_id.'/permissions');
        return $this->request('users/'.$this->user['id'].'/permissions');
    }


    /**
    *   Function to send requests to the "Portail des associations UTC"
    *
    */
    protected function request($path)
    {
        $auth = $this->token;

        $http = new Client([
            'base_uri' => env('BASE_URI').'/api/v1/',
            'headers' => [
                'Authorization' => $auth,
            ],
        ]);
        $response = $http->get($path);
        $data = json_decode((string) $response->getBody(), true);
        return $data;
    }

}
