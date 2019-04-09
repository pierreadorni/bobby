<?php
namespace App\Libraries;


use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\Exceptions\BobbyException;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
    public function authenticateUser($token)
    {
        $this->setToken($token);
        $this->setUser();
        $this->setAssos();
        $this->setPermissions();
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
    protected function setToken($token)
    {
        $this->token = $token;
    }


    /**
    *   Set user information based on token
    *
    */
    protected function setUser()
    {
        if ($this->token) {
            $this->user = $this->getPortalUserInformation();
        } 
    }


    /**
    *   Set associations the user belongs to
    *
    */
    protected function setAssos()
    {
        if ($this->token) {
            $this->assos = $this->getPortalUserAssociations();
        }
    }


    /**
    *   Set Permissions based on the user and the asociations the latter belongs to
    *
    */
    protected function setPermissions()
    {
        // Ajouter attribut uid ou autre dans objet user
        if ($this->token && $this->user) {
            $this->permissions = $this->getPortalUserPermissions();
        } 
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
        $user = $this->user;
        $user['assos'] = $this->assos;

        return $user;
    }


    /**
    *   Get user information
    *
    */
    public function getUserAssociations()
    {
        return $this->assos;
    }


    /**
    *   Get user permissions
    *
    */
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

        if ($this->user) {
            return true;
        }

        throw new HttpException(403, "Unauthorized access");
    }


    /**
    *   Check if the user is a member of the association
    *
    */
    public function isAssociationMember($asso_id){

        $asso = array_filter(
                $this->assos,
                function ($a) use (&$asso_id) {
                    return $a['id'] == $asso_id;
            }
        );

        if ($asso) {
            return true;
        }

        throw new HttpException(403, "Unauthorized access");

    }


    /**
    *   Check if the user has Admin Permision for an association
    *
    */
    public function hasAssociationAdminPermission($asso_id){

        $assos = array_filter(
                $this->assos,
                function ($a) use (&$asso_id) {
                    return $a['id'] == $asso_id;
            }
        );
        if ($assos) {
            if (array_search(reset($assos)['login'].'-admin',$this->permissions)){
                return true;
            }
        }

        throw new HttpException(403, "Unauthorized access");

    }


    /**
    *   Check if user is membre one of the associations
    *
    */
    public function hasInAssociationsAdminPermission($asso_id1, $asso_id2){

        $assos = array_filter(
                $this->assos,
                function ($a) use (&$asso_id) {
                    return $a['id'] == $asso_id1;
            }
        );
        if ($assos) {
            if (array_search(reset($assos)['login'].'-admin',$this->permissions)){
                return true;
            }
        }

        $assos = array_filter(
                $this->assos,
                function ($a) use (&$asso_id) {
                    return $a['id'] == $asso_id2;
            }
        );
        if ($assos) {
            if (array_search(reset($assos)['login'].'-admin',$this->permissions)){
                return true;
            }
        }

        throw new HttpException(403, "Unauthorized access");
    
    }


    /**
    *   Check admin right
    *
    */
    public function isAdmin(){

        if (array_search("admin", $this->permissions)){
            return true;
        }

        throw new HttpException(403, "Unauthorized access");

    }



    /////////////////////////////
    //
    //     PORTAL FUNCTIONS
    //
    /////////////////////////////


    /**
    *   Get all existing associations
    *
    */
    public function indexAsso()
    {
        return $this->request('assos');
    }


    /**
    *   Get information from one association based on uid
    *
    */
    public function showAsso($uid)
    {
        return $this->request('assos/'.$uid);
    }


    /**
    *   Get permissions from the user
    *
    */
    protected function getPortalUserPermissions()
    {
        $permissions = [];

        $permission_admin = $this->getPortalAdminPermissions();

        if ($permission_admin) {
            array_push($permissions, 'admin');
        }

        foreach ($this->assos as $asso) {
            $permission_asso = $this->getPortalAssoPermissions($asso['id']);
            if (array_search("bobby", array_column($permission_asso, 'type'))){
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
